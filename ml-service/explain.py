"""
Lightweight, dependency-free explanation for a single prediction.

Approach:
  For every numeric input, compute how many standard deviations it sits
  from the training-set mean (z-score), then multiply by the model's
  global feature importance for that column. Rank the results and turn
  the top few into plain-language bullets ("High Horsepower",
  "Below-average Weight", ...). For categorical picks (Make/Type/Origin/
  DriveTrain), compare the average MSRP of that category against the
  overall average and surface it if the gap is meaningful.

This is a heuristic, not a SHAP value - it's meant to give a directionally
honest, readable explanation without adding a heavy SHAP dependency.
"""

from typing import Dict, List

import numpy as np
import pandas as pd

NUMERIC_LABELS = {
    "EngineSize": "engine size",
    "Cylinders": "cylinder count",
    "Horsepower": "horsepower",
    "MPG_City": "city fuel economy",
    "MPG_Highway": "highway fuel economy",
    "Weight": "weight",
    "Wheelbase": "wheelbase",
    "Length": "length",
}


class Explainer:
    def __init__(self, model, feature_columns: List[str], cars_df: pd.DataFrame):
        self.model = model
        self.feature_columns = feature_columns
        self.cars_df = cars_df

        importances = model.feature_importances_
        self.importance_by_col = dict(zip(feature_columns, importances))

        self.numeric_stats = {
            col: {"mean": cars_df[col].mean(), "std": cars_df[col].std() or 1.0}
            for col in NUMERIC_LABELS
        }

        self.overall_avg_price = cars_df["MSRP"].mean()
        self.category_avg_price = {
            "Make": cars_df.groupby("Make")["MSRP"].mean(),
            "Type": cars_df.groupby("Type")["MSRP"].mean(),
            "Origin": cars_df.groupby("Origin")["MSRP"].mean(),
            "DriveTrain": cars_df.groupby("DriveTrain")["MSRP"].mean(),
        }

    def explain(self, payload: Dict, max_bullets: int = 4) -> List[str]:
        scored: List[tuple] = []

        # Numeric features
        for col, label in NUMERIC_LABELS.items():
            value = payload.get(col)
            if value is None:
                continue
            stats = self.numeric_stats[col]
            z = (value - stats["mean"]) / stats["std"]
            importance = self.importance_by_col.get(col, 0.0)
            weight = abs(z) * importance
            direction = "High" if z > 0.3 else "Low" if z < -0.3 else "Average"
            if direction != "Average" and weight > 0:
                scored.append((weight, f"{direction} {label}"))

        # Categorical features
        for col in ["Make", "Type", "Origin", "DriveTrain"]:
            value = payload.get(col)
            if value is None or value not in self.category_avg_price[col].index:
                continue
            cat_avg = self.category_avg_price[col][value]
            gap_ratio = (cat_avg - self.overall_avg_price) / self.overall_avg_price
            # crude importance proxy: average one-hot importance for this column family
            family_cols = [c for c in self.feature_columns if c.startswith(f"{col}_")]
            family_importance = (
                np.mean([self.importance_by_col.get(c, 0.0) for c in family_cols])
                if family_cols else 0.0
            )
            weight = abs(gap_ratio) * family_importance * 10
            if abs(gap_ratio) > 0.1 and weight > 0:
                direction = "Premium-positioned" if gap_ratio > 0 else "Value-positioned"
                readable = {
                    "Make": f"{direction} brand ({value})",
                    "Type": f"{value} body style tends to be {'pricier' if gap_ratio > 0 else 'more affordable'}",
                    "Origin": f"{value}-origin vehicles trend {'higher' if gap_ratio > 0 else 'lower'} in price",
                    "DriveTrain": f"{value} drivetrain",
                }
                scored.append((weight, readable[col]))

        scored.sort(key=lambda x: x[0], reverse=True)
        bullets = [text for _, text in scored[:max_bullets]]

        if not bullets:
            bullets = ["This car's specs are close to the dataset average across the board."]

        return bullets
