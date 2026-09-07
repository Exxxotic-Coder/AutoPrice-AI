import axios from "axios";

const mlServiceUrl = (process.env.ML_SERVICE_URL || process.env.ml_service_url || "http://localhost:8000").replace(/\/$/, "");

const mlClient = axios.create({
  baseURL: mlServiceUrl,
  timeout: 45000,
});

/** Maps our camelCase request body to the PascalCase aliases the FastAPI model expects. */
export function toMlPayload(body) {
  return {
    Make: body.make,
    Model: body.model,
    Type: body.type,
    Origin: body.origin,
    DriveTrain: body.driveTrain,
    EngineSize: Number(body.engineSize),
    Cylinders: Number(body.cylinders),
    Horsepower: Number(body.horsepower),
    MPG_City: Number(body.mpgCity),
    MPG_Highway: Number(body.mpgHighway),
    Weight: Number(body.weight),
    Wheelbase: Number(body.wheelbase),
    Length: Number(body.length),
  };
}

export default mlClient;
