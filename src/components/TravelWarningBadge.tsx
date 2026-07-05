interface Props {
  level: string | null;
  size?: "sm" | "md";
}

function levelStyle(level: string | null) {
  if (!level) return { tone: "bg-navy-100 text-navy-700 ring-navy-200", n: null };
  const match = level.match(/(\d)\s*단계/);
  const n = match ? Number(match[1]) : null;
  switch (n) {
    case 1:
      return { tone: "bg-navy-100 text-navy-700 ring-navy-200", n };
    case 2:
      return { tone: "bg-risk-caution/15 text-[#8a6d1f] ring-risk-caution/30", n };
    case 3:
      return { tone: "bg-risk-warn/15 text-[#a3541c] ring-risk-warn/30", n };
    case 4:
      return { tone: "bg-risk-danger/15 text-risk-danger ring-risk-danger/30", n };
    default:
      return { tone: "bg-navy-100 text-navy-700 ring-navy-200", n };
  }
}

export default function TravelWarningBadge({ level, size = "md" }: Props) {
  const { tone } = levelStyle(level);
  const padding = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ${tone} ${padding}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {level ?? "정보 없음"}
    </span>
  );
}
