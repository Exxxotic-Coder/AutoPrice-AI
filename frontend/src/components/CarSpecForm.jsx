const NUMERIC_FIELDS = [
  { key: "engineSize", label: "Engine Size (L)", metaKey: "EngineSize", step: 0.1 },
  { key: "cylinders", label: "Cylinders", metaKey: "Cylinders", step: 1 },
  { key: "horsepower", label: "Horsepower", metaKey: "Horsepower", step: 5 },
  { key: "mpgCity", label: "City MPG", metaKey: "MPG_City", step: 1 },
  { key: "mpgHighway", label: "Highway MPG", metaKey: "MPG_Highway", step: 1 },
  { key: "weight", label: "Weight (lbs)", metaKey: "Weight", step: 10 },
  { key: "wheelbase", label: "Wheelbase (in)", metaKey: "Wheelbase", step: 1 },
  { key: "length", label: "Length (in)", metaKey: "Length", step: 1 },
];

export default function CarSpecForm({ metadata, error, refetch, values, onChange }) {
  if (error && !metadata) {
    return (
      <div style={{ padding: 16, background: "rgba(239, 68, 68, 0.1)", borderRadius: 8, border: "1px solid var(--danger)", marginBottom: 16 }}>
        <p style={{ color: "#f87171", fontWeight: 600, margin: 0 }}>Failed to load vehicle data</p>
        <p style={{ fontSize: "0.85rem", color: "var(--text-dim)", margin: "4px 0 12px" }}>{error}</p>
        {refetch && (
          <button type="button" className="btn btn-secondary" onClick={refetch} style={{ fontSize: "0.85rem", padding: "6px 12px" }}>
            Retry loading
          </button>
        )}
      </div>
    );
  }

  if (!metadata) {
    return <p style={{ color: "var(--text-dim)" }}>Loading vehicle data... (Servers may take 30-50s to wake up on free tier)</p>;
  }

  const modelsForMake = values.make ? metadata.modelsByMake[values.make] || [] : [];

  function set(key, val) {
    onChange({ ...values, [key]: val });
  }

  function handleMakeChange(make) {
    onChange({ ...values, make, model: "" });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="grid-3">
        <div className="field">
          <label>Make</label>
          <select value={values.make || ""} onChange={(e) => handleMakeChange(e.target.value)}>
            <option value="">Select make</option>
            {metadata.makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Model</label>
          <select
            value={values.model || ""}
            onChange={(e) => set("model", e.target.value)}
            disabled={!values.make}
          >
            <option value="">Select model</option>
            {modelsForMake.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Type</label>
          <select value={values.type || ""} onChange={(e) => set("type", e.target.value)}>
            <option value="">Select type</option>
            {metadata.types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Origin</label>
          <select value={values.origin || ""} onChange={(e) => set("origin", e.target.value)}>
            <option value="">Select origin</option>
            {metadata.origins.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Drive Train</label>
          <select
            value={values.driveTrain || ""}
            onChange={(e) => set("driveTrain", e.target.value)}
          >
            <option value="">Select drive train</option>
            {metadata.driveTrains.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid-3">
        {NUMERIC_FIELDS.map(({ key, label, metaKey, step }) => {
          const range = metadata.numericRanges[metaKey];
          return (
            <div className="field" key={key}>
              <label>{label}</label>
              <input
                type="number"
                step={step}
                placeholder={range ? `avg ${range.mean}` : ""}
                value={values[key] ?? ""}
                onChange={(e) => set(key, e.target.value)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { NUMERIC_FIELDS };
