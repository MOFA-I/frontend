import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";

interface RiskVsCoopPoint {
  country: string;
  x: number;
  y: number;
  grade: number;
}

interface Props {
  data: RiskVsCoopPoint[];
}

const GRADE_COLOR = ["var(--color-risk-danger)", "var(--color-risk-warn)", "var(--color-risk-caution)", "var(--color-navy-600)", "var(--color-risk-safe)"];

export default function RiskVsCoopScatter({ data }: Props) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ left: 8, right: 24, top: 8, bottom: 4 }}>
          <CartesianGrid stroke="var(--color-navy-100)" />
          <XAxis
            type="number"
            dataKey="x"
            name="위험도"
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis type="number" dataKey="y" name="협력지수" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <ZAxis type="number" dataKey="grade" range={[80, 260]} />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{ borderRadius: 8, borderColor: "var(--color-navy-100)", fontSize: 12 }}
            formatter={(value: number, name: string) => [value, name]}
            labelFormatter={() => ""}
          />
          <Scatter
            data={data}
            fill="var(--color-navy-700)"
            shape={(props: unknown) => {
              const p = props as { cx: number; cy: number; payload: RiskVsCoopPoint };
              const color = GRADE_COLOR[Math.max(0, Math.min(4, p.payload.grade - 1))];
              return <circle cx={p.cx} cy={p.cy} r={8} fill={color} fillOpacity={0.8} stroke={color} />;
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
