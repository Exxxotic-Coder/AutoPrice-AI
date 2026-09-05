"""
AutoPrice AI - Model Training Script
-------------------------------------
Replicates the cleaning + one-hot-encoding pipeline from the original
"Used Car Price Prediction using XGBoost" notebook, then exports:

  model/xgb_model.pkl        -> trained XGBRegressor
  model/feature_columns.json -> exact column order the model expects
  model/metadata.json        -> dropdown options + numeric ranges for the UI
  model/metrics.json         -> R2 / MAE / RMSE on the held-out test set

Run with:  python train_model.py
"""

import json
import re

import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor

DATA_PATH = "data/cars_data.csv"
MODEL_DIR = "model"

CATEGORICAL_COLS = ["Make", "Model", "Type", "Origin", "DriveTrain"]
NUMERIC_COLS = [
    "EngineSize", "Cylinders", "Horsepower",
    "MPG_City", "MPG_Highway", "Weight", "Wheelbase", "Length",
]


def clean_money_column(series: pd.Series) -> pd.Series:
    """Strips $ and , if present, then casts to int. Works whether or
    not the source column already arrived as a plain number."""
    cleaned = series.astype(str).str.replace(r"[$,]", "", regex=True)
    return cleaned.astype(float).astype(int)


def main():
    print("Loading dataset...")
    cars = pd.read_csv(DATA_PATH)

    # ---- Cleaning (mirrors the notebook) ----
    cars = cars.dropna()
    cars["MSRP"] = clean_money_column(cars["MSRP"])
    cars["Invoice"] = clean_money_column(cars["Invoice"])
    cars["Cylinders"] = cars["Cylinders"].astype(float)

    print(f"Rows after cleaning: {len(cars)}")

    # ---- Metadata for the frontend dropdowns (captured BEFORE encoding) ----
    models_by_make = (
        cars.groupby("Make")["Model"]
        .apply(lambda s: sorted(s.unique().tolist()))
        .to_dict()
    )

    def numeric_range(col):
        return {
            "min": float(cars[col].min()),
            "max": float(cars[col].max()),
            "mean": round(float(cars[col].mean()), 2),
        }

    metadata = {
        "makes": sorted(cars["Make"].unique().tolist()),
        "modelsByMake": models_by_make,
        "types": sorted(cars["Type"].unique().tolist()),
        "origins": sorted(cars["Origin"].unique().tolist()),
        "driveTrains": sorted(cars["DriveTrain"].unique().tolist()),
        "numericRanges": {col: numeric_range(col) for col in NUMERIC_COLS},
        "priceRange": {
            "min": int(cars["MSRP"].min()),
            "max": int(cars["MSRP"].max()),
        },
        "rowCount": int(len(cars)),
    }

    # ---- One-hot encoding (mirrors the notebook) ----
    df_dummies = pd.get_dummies(cars, columns=CATEGORICAL_COLS)
    df_data = df_dummies.drop(["Invoice"], axis=1)

    X = df_data.drop(["MSRP"], axis=1)
    y = df_data["MSRP"]

    feature_columns = X.columns.tolist()

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print("Training XGBRegressor...")
    model = XGBRegressor(
        n_estimators=300,
        max_depth=4,
        learning_rate=0.08,
        subsample=0.9,
        colsample_bytree=0.9,
        random_state=42,
    )
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    metrics = {
        "r2": round(float(r2_score(y_test, preds)), 4),
        "mae": round(float(mean_absolute_error(y_test, preds)), 2),
        "rmse": round(float(np.sqrt(mean_squared_error(y_test, preds))), 2),
    }
    print("Test metrics:", metrics)

    # ---- Persist everything the API needs ----
    joblib.dump(model, f"{MODEL_DIR}/xgb_model.pkl")

    with open(f"{MODEL_DIR}/feature_columns.json", "w") as f:
        json.dump(feature_columns, f)

    with open(f"{MODEL_DIR}/metadata.json", "w") as f:
        json.dump(metadata, f, indent=2)

    with open(f"{MODEL_DIR}/metrics.json", "w") as f:
        json.dump(metrics, f, indent=2)

    print(f"Saved model + metadata to {MODEL_DIR}/")


if __name__ == "__main__":
    main()
