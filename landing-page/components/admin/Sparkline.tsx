// Hand-rolled SVG sparkline. Inline path, no chart library.
// Server-rendered: zero JS shipped to the client for the chart itself.

type Props = {
  data: number[];
  width?: number;
  height?: number;
  color?: string;        // primary stroke
  fillColor?: string;    // gradient bottom (transparent at base)
  ariaLabel?: string;
};

export default function Sparkline({
  data,
  width = 120,
  height = 32,
  color = "#2B7BFF",
  fillColor = "rgba(43, 123, 255, 0.18)",
  ariaLabel,
}: Props) {
  if (!data.length) return null;

  const max = Math.max(1, ...data);
  const min = Math.min(0, ...data);
  const range = Math.max(1, max - min);
  const stepX = data.length > 1 ? width / (data.length - 1) : 0;

  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 2) - 1;
    return [x, y] as const;
  });

  const linePath = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  const areaPath =
    `${linePath} L${(width).toFixed(1)},${height} L0,${height} Z`;

  const last = points[points.length - 1];
  const lastValue = data[data.length - 1];
  const isFlat = data.every((v) => v === data[0]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
      style={{ display: "block", overflow: "visible" }}
    >
      <path d={areaPath} fill={fillColor} />
      <path
        d={linePath}
        stroke={color}
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {!isFlat && lastValue > 0 && (
        <>
          <circle cx={last[0]} cy={last[1]} r={3} fill={color} />
          <circle cx={last[0]} cy={last[1]} r={6} fill={color} fillOpacity={0.2} />
        </>
      )}
    </svg>
  );
}
