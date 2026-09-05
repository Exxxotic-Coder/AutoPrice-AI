import { useEffect, useState } from "react";
import client from "../api/client.js";

export default function History() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoritesOnly]);

  async function load() {
    setLoading(true);
    try {
      const { data } = await client.get("/history", {
        params: favoritesOnly ? { favoritesOnly: true } : {},
      });
      setPredictions(data);
    } catch (err) {
      setError(err.response?.data?.error || "Could not load history");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    await client.delete(`/history/${id}`);
    setPredictions((prev) => prev.filter((p) => p._id !== id));
  }

  async function handleFavorite(id) {
    const { data } = await client.patch(`/history/${id}/favorite`);
    setPredictions((prev) => prev.map((p) => (p._id === id ? data : p)));
  }

  async function handleDownload(prediction) {
    const token = localStorage.getItem("autoprice_token");
    const base = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const res = await fetch(`${base}/report/${prediction._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AutoPriceAI_${prediction.make}_${prediction.model}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 className="display" style={{ fontSize: "2rem" }}>Prediction history</h1>
        <button className="btn btn-secondary" onClick={() => setFavoritesOnly((v) => !v)}>
          {favoritesOnly ? "Showing favorites" : "Show favorites only"}
        </button>
      </div>

      {loading && <p style={{ color: "var(--text-dim)" }}>Loading...</p>}
      {error && <div className="error-banner">{error}</div>}

      {!loading && predictions.length === 0 && (
        <p style={{ color: "var(--text-dim)" }}>No predictions yet. Go make one!</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {predictions.map((p) => (
          <div
            key={p._id}
            className="card"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}
          >
            <div>
              <p style={{ fontWeight: 600 }}>{p.make} {p.model}</p>
              <p className="mono" style={{ color: "var(--accent)", fontSize: "1.1rem" }}>
                ${Number(p.predictedPrice).toLocaleString()}
              </p>
              <p style={{ color: "var(--text-dim)", fontSize: "0.8rem" }}>
                {new Date(p.createdAt).toLocaleString()}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => handleFavorite(p._id)}>
                {p.isFavorite ? "❤️" : "🤍"}
              </button>
              <button className="btn btn-secondary" onClick={() => handleDownload(p)}>
                ⬇ PDF
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(p._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
