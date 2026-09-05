import { useState } from "react";
import client from "../api/client.js";
import { useMetadata } from "../api/useMetadata.js";
import CarSpecForm from "../components/CarSpecForm.jsx";
import ResultCard from "../components/ResultCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const EMPTY = {
  make: "", model: "", type: "", origin: "", driveTrain: "",
  engineSize: "", cylinders: "", horsepower: "", mpgCity: "",
  mpgHighway: "", weight: "", wheelbase: "", length: "",
};

export default function Predict() {
  const { metadata } = useMetadata();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState(EMPTY);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const { data } = await client.post("/predict", values);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <p className="eyebrow">Predict price</p>
      <h1 className="display" style={{ fontSize: "2rem", margin: "8px 0 24px" }}>
        Enter the vehicle's specs
      </h1>

      <form onSubmit={handleSubmit} className="panel" style={{ padding: 24, marginBottom: 28 }}>
        <CarSpecForm metadata={metadata} values={values} onChange={setValues} />

        {error && <div className="error-banner" style={{ marginTop: 16 }}>{error}</div>}

        <div style={{ marginTop: 20 }}>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Predicting..." : "Predict price"}
          </button>
          {!user && (
            <span style={{ marginLeft: 12, fontSize: "0.85rem", color: "var(--text-dim)" }}>
              You'll need to log in first — predictions are saved to your account.
            </span>
          )}
        </div>
      </form>

      {result && <ResultCard prediction={result} priceRange={metadata?.priceRange} />}
    </div>
  );
}
