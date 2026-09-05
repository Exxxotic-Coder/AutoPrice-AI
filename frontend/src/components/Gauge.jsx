/**
 * Semicircular instrument-cluster gauge. The needle sweeps from -90deg to
 * +90deg based on where `value` sits between `min` and `max`. This is the
 * app's signature visual element, echoed in miniature as the logo mark.
 */
export default function Gauge({ value, min, max, label, formattedValue }) {
  const clamped = Math.min(Math.max(value, min), max);
  const pct = max > min ? (clamped - min) / (max - min) : 0;
  const angle = -90 + pct * 180; // degrees

  const radius = 90;
  const cx = 110;
  const cy = 110;

  const needleRad = (angle * Math.PI) / 180;
  const needleX = cx + radius * 0.78 * Math.cos(needleRad);
  const needleY = cy + radius * 0.78 * Math.sin(needleRad);

  const ticks = Array.from({ length: 9 }, (_, i) => {
    const tAngle = -90 + (i / 8) * 180;
    const rad = (tAngle * Math.PI) / 180;
    const x1 = cx + radius * 0.98 * Math.cos(rad);
    const y1 = cy + radius * 0.98 * Math.sin(rad);
    const x2 = cx + radius * 0.86 * Math.cos(rad);
    const y2 = cy + radius * 0.86 * Math.sin(rad);
    return { x1, y1, x2, y2 };
  });

  return (
    <svg viewBox="0 0 220 130" width="100%" style={{ maxWidth: 280 }}>
      <path
        d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
        fill="none"
        stroke="var(--border)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${
          cx + radius * Math.cos((angle * Math.PI) / 180)
        } ${cy + radius * Math.sin((angle * Math.PI) / 180)}`}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke="var(--text-dim)"
          strokeWidth="2"
        />
      ))}
      <line
        x1={cx}
        y1={cy}
        x2={needleX}
        y2={needleY}
        stroke="var(--accent-2)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r="5" fill="var(--accent-2)" />
      <text
        x={cx}
        y={cy - 20}
        textAnchor="middle"
        className="mono"
        fontSize="18"
        fontWeight="700"
        fill="var(--text)"
      >
        {formattedValue}
      </text>
      {label && (
        <text
          x={cx}
          y={cy - 2}
          textAnchor="middle"
          fontSize="10"
          letterSpacing="1"
          fill="var(--text-dim)"
        >
          {label.toUpperCase()}
        </text>
      )}
    </svg>
  );
}
