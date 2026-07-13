import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ReactNode } from "react";
import InfoTooltip from "./InfoTooltip";

interface Props {
  data: [string, number][];
  domain?: [number, number];
  valueFormatter?: (value: number) => string;
  valueLabel?: string;
  note?: ReactNode;
}

export default function RankedBarChart({ data: pairs, domain, valueFormatter, valueLabel = "값", note }: Props) {
  const data = pairs.map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  const format = valueFormatter ?? ((v: number) => `${v}`);

  return (
    <div className="relative h-56 w-full">
      {note && (
        <span className="absolute top-0 right-0 z-10">
          <InfoTooltip>{note}</InfoTooltip>
        </span>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
          <CartesianGrid horizontal={false} stroke="var(--color-navy-100)" />
          <XAxis type="number" domain={domain ?? [0, "auto"]} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="label"
            width={90}
            tick={{ fontSize: 12, fill: "var(--color-navy-950)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "var(--color-navy-50)" }}
            contentStyle={{ borderRadius: 8, borderColor: "var(--color-navy-100)", fontSize: 12 }}
            formatter={(value: number) => [format(value), valueLabel]}
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={16} isAnimationActive={false}>
            {data.map((d, i) => (
              <Cell key={d.label} fill={i === 0 ? "var(--color-gold-500)" : "var(--color-navy-600)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
