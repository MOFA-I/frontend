interface Props {
  label: string;
  value: string | number;
  max?: number | null;
  sub?: string | null;
  color?: string | null;
}

export default function StatCard({ label, value, max, sub, color }: Props) {
  return (
    <div>
      <p className="text-xs text-navy-700/50 mb-1.5">{label}</p>
      <p className="text-2xl font-bold" style={color ? { color } : { color: "var(--color-navy-950)" }}>
        {value}
        {max != null && <span className="text-sm font-normal text-navy-700/50"> / {max}</span>}
      </p>
      {sub && <p className="text-xs text-navy-700/50 mt-1">{sub}</p>}
    </div>
  );
}
