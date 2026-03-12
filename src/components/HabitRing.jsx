// --- Ring Component ---
import { useMemo } from "react";

const polarToXY = (cx, cy, angleDeg, r) => {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const describeArc = (cx, cy, startDeg, endDeg, r) => {
  const start = polarToXY(cx, cy, startDeg, r);
  const end = polarToXY(cx, cy, endDeg, r);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
};

export const HabitRing = ({
  count,
  goal,
  color,
  size,
  stroke,
  previewCount,
}) => {
  const segments = goal;
  const radius = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const gapDeg = segments > 1 ? 6 : 0;
  const segmentDeg =
    segments === 1 ? 359.9 : (360 - gapDeg * segments) / segments;
  const filled = Math.min(count, goal);
  const previewing = Math.min(previewCount ?? count, goal);
  const segmentArcLength = (segmentDeg * Math.PI * radius) / 180;

  const arcs = useMemo(() => {
    return Array.from({ length: segments }).map((_, i) => {
      const startDeg = i * (segmentDeg + gapDeg);
      const endDeg = startDeg + segmentDeg;
      return { startDeg, endDeg };
    });
  }, [segments, segmentDeg, gapDeg]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {arcs.map(({ startDeg, endDeg }, i) => {
        const arc = describeArc(cx, cy, startDeg, endDeg, radius);
        const isFilled = i < filled;
        const isPreview = !isFilled && i < previewing;

        return (
          <g key={i}>
            {/* Track */}
            <path
              d={arc}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
            {/* Filled segment */}
            <path
              d={arc}
              fill="none"
              stroke={color}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={segmentArcLength}
              strokeDashoffset={isFilled || isPreview ? 0 : segmentArcLength}
              opacity={isPreview ? 0.35 : 1}
              style={{
                transition: isFilled
                  ? `stroke-dashoffset 0.45s cubic-bezier(0.22, 1, 0.36, 1) ${i * 30}ms, opacity 0.2s ease`
                  : `stroke-dashoffset 0.3s ease, opacity 0.2s ease`,
              }}
            />
          </g>
        );
      })}
    </svg>
  );
};
