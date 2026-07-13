interface Props {
  score: number; // 0-100
  color?: string | null;
  sub?: string | null;
}

function riskColor(score: number) {
  if (score < 30) return "var(--color-risk-safe)";
  if (score < 55) return "var(--color-risk-caution)";
  if (score < 75) return "var(--color-risk-warn)";
  return "var(--color-risk-danger)";
}

function riskLabel(score: number) {
  if (score < 30) return "낮음";
  if (score < 55) return "보통";
  if (score < 75) return "주의";
  return "높음";
}

export default function RiskGauge({ score, color: colorProp, sub }: Props) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 70;
  const circumference = Math.PI * radius; // half circle
  const offset = circumference * (1 - clamped / 100);
  const color = colorProp ?? riskColor(clamped);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 170 95" className="w-full max-w-[220px]">
        <path
          d="M 15 90 A 70 70 0 0 1 155 90"
          fill="none"
          stroke="var(--color-navy-100)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 15 90 A 70 70 0 0 1 155 90"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
        />
        <text x="85" y="80" textAnchor="middle" fontSize="30" fontWeight="700" fill="var(--color-navy-950)">
          {clamped}
        </text>
      </svg>
      <div className="flex items-center gap-1.5 -mt-2">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-sm font-semibold" style={{ color }}>
          진출 리스크 {riskLabel(clamped)}
        </span>
      </div>
      {sub && <p className="text-xs text-navy-700/50 mt-1">{sub}</p>}
    </div>
  );
}
