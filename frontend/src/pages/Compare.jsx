import { useState } from "react";
import client from "../api/client.js";
import { useMetadata } from "../api/useMetadata.js";
import CarSpecForm from "../components/CarSpecForm.jsx";
import Gauge from "../components/Gauge.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const EMPTY = {
  make: "", model: "", type: "", origin: "", driveTrain: "",
  engineSize: "", cylinders: "", horsepower: "", mpgCity: "",
  mpgHighway: "", weight: "", wheelbase: "", length: "",
};

export default function Compare() {
  const { metadata, error: metadataError, refetch } = useMetadata();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [carA, setCarA] = useState(EMPTY);
  const [carB, setCarB] = useState(EMPTY);
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
      const { data } = await client.post("/compare", { carA, carB });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || "Comparison failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const priceRange = metadata?.priceRange;

  return (
    <div className="page">
      <p className="eyebrow">Compare</p>
      <h1 className="display" style={{ fontSize: "2rem", margin: "8px 0 24px" }}>
        Put two cars head-to-head
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid-2">
          <div className="panel" style={{ padding: 20 }}>
            <h3 style={{ marginBottom: 14, color: "var(--accent)" }}>Car A</h3>
            <CarSpecForm metadata={metadata} error={metadataError} refetch={refetch} values={carA} onChange={setCarA} />
          </div>
          <div className="panel" style={{ padding: 20 }}>
            <h3 style={{ marginBottom: 14, color: "var(--accent-2)" }}>Car B</h3>
            <CarSpecForm metadata={metadata} error={metadataError} refetch={refetch} values={carB} onChange={setCarB} />
          </div>
        </div>

        {error && <div className="error-banner" style={{ marginTop: 16 }}>{error}</div>}

        <div style={{ marginTop: 20 }}>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Comparing..." : "Compare predicted prices"}
          </button>
        </div>
      </form>

      {result && (
        <div className="panel" style={{ padding: 28, marginTop: 28, display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
          <ComparePanel title={`${carA.make} ${carA.model}`} data={result.carA} priceRange={priceRange} color="var(--accent)" />
          <div style={{ alignSelf: "center", color: "var(--text-dim)", fontFamily: "var(--font-display)", fontSize: "1.4rem" }}>
            VS
          </div>
          <ComparePanel title={`${carB.make} ${carB.model}`} data={result.carB} priceRange={priceRange} color="var(--accent-2)" />
        </div>
      )}
    </div>
  );
}

function ComparePanel({ title, data, priceRange, color }) {
  const formatted = `$${Number(data.predictedPrice).toLocaleString()}`;
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: "var(--text-dim)", marginBottom: 6 }}>{title}</p>
      <Gauge
        value={data.predictedPrice}
        min={priceRange?.min ?? 0}
        max={priceRange?.max ?? data.predictedPrice * 1.5}
        formattedValue={formatted}
      />
      <ul style={{ textAlign: "left", margin: "10px 0 0", paddingLeft: 18, fontSize: "0.85rem", color: "var(--text-dim)" }}>
        {data.explanation.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
