import axios from "axios";

const mlClient = axios.create({
  baseURL: process.env.ML_SERVICE_URL || "http://localhost:8000",
  timeout: 10000,
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
