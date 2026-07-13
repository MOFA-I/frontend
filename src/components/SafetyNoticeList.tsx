import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import type { SafetyNotice } from "../types";

interface Props {
  notices: SafetyNotice[];
}

function NoticeSummary({ summary }: { summary: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = summary.length > 140;

  return (
    <p className="text-xs text-navy-700/60 leading-relaxed">
      <span className={expanded ? "" : "line-clamp-3"}>{summary}</span>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="block mt-1 text-[11px] font-semibold text-navy-700/80 hover:text-navy-950"
        >
          {expanded ? "접기" : "더보기"}
        </button>
      )}
    </p>
  );
}

export default function SafetyNoticeList({ notices }: Props) {
  if (notices.length === 0) {
    return <p className="text-sm text-navy-700/50">최근 안전공지가 없습니다.</p>;
  }
  return (
    <ul className="divide-y divide-navy-100">
      {notices.map((n, i) => (
        <li key={i} className="py-3 first:pt-0 last:pb-0 flex gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-risk-warn/10 text-risk-warn mt-0.5">
            <AlertTriangle size={13} />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-sm font-semibold text-navy-950 truncate">{n.title ?? "제목 없음"}</p>
              {n.date && <span className="text-[11px] text-navy-700/40 shrink-0">{n.date}</span>}
            </div>
            {n.summary && <NoticeSummary summary={n.summary} />}
          </div>
        </li>
      ))}
    </ul>
  );
}
