import { useState } from "react";
import client from "../api/client.js";
import Gauge from "./Gauge.jsx";

export default function ResultCard({ prediction, priceRange, onFavoriteToggled }) {
  const [downloading, setDownloading] = useState(false);
  const [favBusy, setFavBusy] = useState(false);
  const [isFavorite, setIsFavorite] = useState(prediction.isFavorite);

  const formatted = `$${Number(prediction.predictedPrice).toLocaleString()}`;

  async function handleDownload() {
    setDownloading(true);
    try {
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
    } finally {
      setDownloading(false);
    }
  }

  async function handleFavorite() {
    if (!prediction._id) return;
    setFavBusy(true);
    try {
      const { data } = await client.patch(`/history/${prediction._id}/favorite`);
      setIsFavorite(data.isFavorite);
      onFavoriteToggled?.(data);
    } finally {
      setFavBusy(false);
    }
  }

  return (
    <div className="panel" style={{ padding: 28, display: "flex", gap: 28, flexWrap: "wrap" }}>
      <div style={{ flex: "0 0 auto", display: "flex", justifyContent: "center" }}>
        <Gauge
          value={prediction.predictedPrice}
          min={priceRange?.min ?? 0}
          max={priceRange?.max ?? prediction.predictedPrice * 1.5}
          formattedValue={formatted}
          label="Predicted MSRP"
        />
      </div>

      <div style={{ flex: 1, minWidth: 240 }}>
        <p className="eyebrow">Predicted Price</p>
        <h2 className="mono" style={{ fontSize: "2rem", color: "var(--accent)", margin: "4px 0 14px" }}>
          {formatted}
        </h2>

        {prediction.explanation?.length > 0 && (
          <>
            <p style={{ fontSize: "0.85rem", color: "var(--text-dim)", marginBottom: 6 }}>
              Why this price:
            </p>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
              {prediction.explanation.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </>
        )}

        {prediction._id && (
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button className="btn btn-secondary" onClick={handleFavorite} disabled={favBusy}>
              {isFavorite ? "❤️ Favorited" : "🤍 Save to favorites"}
            </button>
            <button className="btn btn-secondary" onClick={handleDownload} disabled={downloading}>
              {downloading ? "Preparing PDF..." : "⬇ Download report"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
