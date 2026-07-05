import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props {
  scores: Record<string, number>;
}

export default function OpportunityBarChart({ scores }: Props) {
  const data = Object.entries(scores)
    .map(([field, score]) => ({ field, score }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
          <CartesianGrid horizontal={false} stroke="var(--color-navy-100)" />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="field"
            width={90}
            tick={{ fontSize: 12, fill: "var(--color-navy-950)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "var(--color-navy-50)" }}
            contentStyle={{ borderRadius: 8, borderColor: "var(--color-navy-100)", fontSize: 12 }}
            formatter={(value: number) => [`${value}점`, "기회 점수"]}
          />
          <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={16} isAnimationActive={false}>
            {data.map((d, i) => (
              <Cell key={d.field} fill={i === 0 ? "var(--color-gold-500)" : "var(--color-navy-600)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
