import type { RecentSituation } from "../types";

interface Props {
  situations: RecentSituation[];
}

export default function TimelineList({ situations }: Props) {
  if (situations.length === 0) {
    return <p className="text-sm text-navy-700/50">최근 정세 정보가 없습니다.</p>;
  }
  return (
    <ol className="relative border-l border-navy-100 pl-5 space-y-5">
      {situations.map((s, i) => (
        <li key={i} className="relative">
          <span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-navy-700 ring-4 ring-navy-50" />
          <p className="text-[11px] font-medium text-navy-700/50 mb-0.5">{s.date}</p>
          <p className="text-sm text-navy-950 leading-relaxed">{s.event ?? "-"}</p>
        </li>
      ))}
    </ol>
  );
}
