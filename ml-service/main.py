"""
AutoPrice AI - ML Microservice (FastAPI)
------------------------------------------
Loads the trained XGBoost model once at startup and serves:

  GET  /health              -> liveness check
  GET  /metadata             -> dropdown options + numeric ranges + model metrics
  POST /predict               -> { predictedPrice, explanation[] } for one car
  POST /compare                -> predictions for two cars side by side

This service has no knowledge of users, auth, or MongoDB - that all lives
in the Express backend, which is the only client allowed to call this API.
"""

import json
import os
from typing import List, Optional

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from explain import Explainer

MODEL_DIR = "model"
DATA_PATH = "data/cars_data.csv"

app = FastAPI(title="AutoPrice AI - ML Service", version="1.0.0")

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Load artifacts once at startup ----
model = joblib.load(f"{MODEL_DIR}/xgb_model.pkl")

with open(f"{MODEL_DIR}/feature_columns.json") as f:
    FEATURE_COLUMNS: List[str] = json.load(f)

with open(f"{MODEL_DIR}/metadata.json") as f:
    METADATA = json.load(f)

with open(f"{MODEL_DIR}/metrics.json") as f:
    METRICS = json.load(f)

# Re-load the cleaned dataframe (small, 428 rows) to power the explainer
_raw = pd.read_csv(DATA_PATH).dropna()
for col in ["MSRP", "Invoice"]:
    _raw[col] = (
        _raw[col].astype(str).str.replace(r"[$,]", "", regex=True).astype(float).astype(int)
    )
explainer = Explainer(model, FEATURE_COLUMNS, _raw)


class CarInput(BaseModel):
    make: str = Field(..., alias="Make")
    model: str = Field(..., alias="Model")
    type: str = Field(..., alias="Type")
    origin: str = Field(..., alias="Origin")
    driveTrain: str = Field(..., alias="DriveTrain")
    engineSize: float = Field(..., alias="EngineSize", gt=0)
    cylinders: float = Field(..., alias="Cylinders", ge=0)
    horsepower: float = Field(..., alias="Horsepower", gt=0)
    mpgCity: float = Field(..., alias="MPG_City", gt=0)
    mpgHighway: float = Field(..., alias="MPG_Highway", gt=0)
    weight: float = Field(..., alias="Weight", gt=0)
    wheelbase: float = Field(..., alias="Wheelbase", gt=0)
    length: float = Field(..., alias="Length", gt=0)

    class Config:
        populate_by_name = True


class CompareInput(BaseModel):
    carA: CarInput
    carB: CarInput


def build_feature_vector(car: CarInput) -> pd.DataFrame:
    row = {col: 0 for col in FEATURE_COLUMNS}

    numeric_map = {
        "EngineSize": car.engineSize,
        "Cylinders": car.cylinders,
        "Horsepower": car.horsepower,
        "MPG_City": car.mpgCity,
        "MPG_Highway": car.mpgHighway,
        "Weight": car.weight,
        "Wheelbase": car.wheelbase,
        "Length": car.length,
    }
    for col, value in numeric_map.items():
        if col in row:
            row[col] = value

    categorical_map = {
        "Make": car.make,
        "Model": car.model,
        "Type": car.type,
        "Origin": car.origin,
        "DriveTrain": car.driveTrain,
    }
    for prefix, value in categorical_map.items():
        dummy_col = f"{prefix}_{value}"
        if dummy_col in row:
            row[dummy_col] = 1
        # unseen category -> all dummies for that column stay 0.
        # The model still predicts using the numeric specs; less accurate
        # but never crashes.

    return pd.DataFrame([row], columns=FEATURE_COLUMNS)


def run_prediction(car: CarInput):
    X = build_feature_vector(car)
    predicted = float(model.predict(X)[0])
    predicted = max(predicted, 0)

    payload_for_explainer = {
        "Make": car.make, "Type": car.type, "Origin": car.origin, "DriveTrain": car.driveTrain,
        "EngineSize": car.engineSize, "Cylinders": car.cylinders, "Horsepower": car.horsepower,
        "MPG_City": car.mpgCity, "MPG_Highway": car.mpgHighway, "Weight": car.weight,
        "Wheelbase": car.wheelbase, "Length": car.length,
    }
    explanation = explainer.explain(payload_for_explainer)

    return {
        "predictedPrice": round(predicted, 2),
        "explanation": explanation,
    }


@app.get("/health")
def health():
    return {"status": "ok", "modelLoaded": model is not None}


@app.get("/metadata")
def metadata():
    return {**METADATA, "modelMetrics": METRICS}


@app.post("/predict")
def predict(car: CarInput):
    try:
        return run_prediction(car)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.post("/compare")
def compare(payload: CompareInput):
    try:
        result_a = run_prediction(payload.carA)
        result_b = run_prediction(payload.carB)
        return {"carA": result_a, "carB": result_b}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))
