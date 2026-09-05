import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import client from "../api/client.js";

const PIE_COLORS = ["#F2A93B", "#5FA8D3", "#6FCF97", "#E2685C", "#A78BFA", "#F2A93B99"];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    client
      .get("/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.error || "Could not load dashboard"));
  }, []);

  if (error) return <div className="page"><div className="error-banner">{error}</div></div>;
  if (!data) return <div className="page"><p style={{ color: "var(--text-dim)" }}>Loading...</p></div>;

  const chartData = data.priceOverTime.map((p, i) => ({
    index: i + 1,
    price: p.price,
    date: new Date(p.date).toLocaleDateString(),
  }));

  return (
    <div className="page">
      <h1 className="display" style={{ fontSize: "2rem", marginBottom: 24 }}>Dashboard</h1>

      <div className="grid-3" style={{ marginBottom: 32 }}>
        <StatCard label="Predictions made" value={data.predictionsMade} />
        <StatCard label="Average predicted price" value={`$${data.averagePredictedPrice.toLocaleString()}`} />
        <StatCard label="Most predicted brand" value={data.mostPredictedBrand || "—"} />
      </div>

      <div className="grid-2" style={{ marginBottom: 32 }}>
        <div className="panel" style={{ padding: 20, height: 300 }}>
          <h3 style={{ marginBottom: 10, fontSize: "1rem" }}>Predicted price over time</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={chartData}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="index" stroke="var(--text-dim)" fontSize={12} />
              <YAxis stroke="var(--text-dim)" fontSize={12} />
              <Tooltip
                contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                formatter={(v) => [`$${v.toLocaleString()}`, "Predicted price"]}
              />
              <Line type="monotone" dataKey="price" stroke="var(--accent)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="panel" style={{ padding: 20, height: 300 }}>
          <h3 style={{ marginBottom: 10, fontSize: "1rem" }}>Most predicted brands</h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={data.brandDistribution}
                dataKey="count"
                nameKey="brand"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ brand }) => brand}
              >
                {data.brandDistribution.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h3 style={{ marginBottom: 12, fontSize: "1.1rem" }}>Recent predictions</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.recentPredictions.map((p) => (
          <div key={p._id} className="card" style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{p.make} {p.model}</span>
            <span className="mono" style={{ color: "var(--accent)" }}>
              ${Number(p.predictedPrice).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card">
      <p style={{ color: "var(--text-dim)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </p>
      <p className="mono" style={{ fontSize: "1.6rem", marginTop: 6, color: "var(--accent)" }}>{value}</p>
    </div>
  );
}
