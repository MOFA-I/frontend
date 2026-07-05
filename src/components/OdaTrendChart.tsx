import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props {
  data: { year: number; amount_million_usd: number }[];
}

export default function OdaTrendChart({ data }: Props) {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -16, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="odaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-navy-600)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--color-navy-600)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--color-navy-100)" />
          <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={40} />
          <Tooltip
            contentStyle={{ borderRadius: 8, borderColor: "var(--color-navy-100)", fontSize: 12 }}
            formatter={(value: number) => [`$${value}M`, "ODA 규모"]}
          />
          <Area
            type="monotone"
            dataKey="amount_million_usd"
            stroke="var(--color-navy-700)"
            strokeWidth={2}
            fill="url(#odaFill)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
