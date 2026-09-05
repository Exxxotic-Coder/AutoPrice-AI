import Prediction from "../models/Prediction.js";
import mlClient, { toMlPayload } from "../services/mlClient.js";

const REQUIRED_FIELDS = [
  "make", "model", "type", "origin", "driveTrain",
  "engineSize", "cylinders", "horsepower", "mpgCity", "mpgHighway",
  "weight", "wheelbase", "length",
];

function validateBody(body) {
  const missing = REQUIRED_FIELDS.filter((f) => body[f] === undefined || body[f] === "");
  return missing;
}

export async function getMetadata(req, res) {
  try {
    const { data } = await mlClient.get("/metadata");
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: "ML service unavailable", details: err.message });
  }
}

export async function predict(req, res) {
  const missing = validateBody(req.body);
  if (missing.length) {
    return res.status(400).json({ error: `Missing fields: ${missing.join(", ")}` });
  }

  try {
    const { data } = await mlClient.post("/predict", toMlPayload(req.body));

    const saved = await Prediction.create({
      userId: req.userId,
      make: req.body.make,
      model: req.body.model,
      type: req.body.type,
      origin: req.body.origin,
      driveTrain: req.body.driveTrain,
      engineSize: req.body.engineSize,
      cylinders: req.body.cylinders,
      horsepower: req.body.horsepower,
      mpgCity: req.body.mpgCity,
      mpgHighway: req.body.mpgHighway,
      weight: req.body.weight,
      wheelbase: req.body.wheelbase,
      length: req.body.length,
      predictedPrice: data.predictedPrice,
      explanation: data.explanation,
    });

    res.status(201).json(saved);
  } catch (err) {
    const detail = err.response?.data?.detail || err.message;
    res.status(502).json({ error: "Prediction failed", details: detail });
  }
}

export async function compare(req, res) {
  const { carA, carB } = req.body;
  if (!carA || !carB) {
    return res.status(400).json({ error: "carA and carB are both required" });
  }
  const missingA = validateBody(carA);
  const missingB = validateBody(carB);
  if (missingA.length || missingB.length) {
    return res.status(400).json({
      error: "Missing fields",
      details: { carA: missingA, carB: missingB },
    });
  }

  try {
    const { data } = await mlClient.post("/compare", {
      carA: toMlPayload(carA),
      carB: toMlPayload(carB),
    });
    res.json(data);
  } catch (err) {
    const detail = err.response?.data?.detail || err.message;
    res.status(502).json({ error: "Comparison failed", details: detail });
  }
}
