interface Props {
  index: number; // 1-5
}

const LABELS = ["매우 낮음", "낮음", "보통", "높음", "매우 높음"];

export default function CooperationIndex({ index }: Props) {
  const clamped = Math.max(1, Math.min(5, index));
  return (
    <div>
      <div className="flex gap-1.5 mb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-2.5 flex-1 rounded-full transition-colors ${i <= clamped ? "bg-navy-700" : "bg-navy-100"}`}
          />
        ))}
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-navy-950">Cooperation Index {clamped}/5</span>
        <span className="text-xs text-navy-700/60">{LABELS[clamped - 1]}</span>
      </div>
    </div>
  );
}
