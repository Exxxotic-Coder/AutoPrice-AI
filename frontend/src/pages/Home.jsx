import { Link } from "react-router-dom";
import Gauge from "../components/Gauge.jsx";

export default function Home() {
  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 48,
          flexWrap: "wrap",
          padding: "40px 0",
        }}
      >
        <div style={{ flex: "1 1 380px" }}>
          <p className="eyebrow">Machine-learning valuation</p>
          <h1 className="display" style={{ fontSize: "2.6rem", lineHeight: 1.15, margin: "10px 0 18px" }}>
            Predict your car's market value in seconds.
          </h1>
          <p style={{ color: "var(--text-dim)", fontSize: "1.05rem", maxWidth: 460, lineHeight: 1.6 }}>
            AutoPrice AI runs an XGBoost regression model trained on real
            manufacturer listing data — specs in, an instant, explainable
            price estimate out.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            <Link to="/predict" className="btn btn-primary">
              Predict a price
            </Link>
            <Link to="/compare" className="btn btn-secondary">
              Compare two cars
            </Link>
          </div>
        </div>

        <div className="panel" style={{ padding: 32, display: "flex", justifyContent: "center", flex: "0 0 auto" }}>
          <Gauge value={32000} min={10000} max={90000} formattedValue="$32,000" label="Sample estimate" />
        </div>
      </div>

      <div className="grid-3" style={{ marginTop: 40 }}>
        <FeatureCard
          title="Explainable estimates"
          body="Every prediction ships with plain-language reasons behind the number — not just a black-box figure."
        />
        <FeatureCard
          title="Track your history"
          body="Every prediction is saved to your account. Revisit, favorite, or export any of them as a PDF report."
        />
        <FeatureCard
          title="Side-by-side comparison"
          body="Put two cars head-to-head and see how their specs translate into predicted price."
        />
      </div>
    </div>
  );
}

function FeatureCard({ title, body }) {
  return (
    <div className="card">
      <h3 style={{ fontSize: "1.05rem", marginBottom: 8 }}>{title}</h3>
      <p style={{ color: "var(--text-dim)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>{body}</p>
    </div>
  );
}
