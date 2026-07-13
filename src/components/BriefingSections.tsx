import type { ReportBriefing } from "../types";
import MarkdownBriefing from "./MarkdownBriefing";

interface Props {
  briefing: ReportBriefing;
}

const SECTIONS: { key: keyof ReportBriefing; title: string }[] = [
  { key: "executive_summary", title: "Executive Summary" },
  { key: "situation_analysis", title: "현황 분석" },
  { key: "risk_analysis", title: "위험 분석" },
  { key: "opportunity_analysis", title: "기회 분석" },
  { key: "recommendation", title: "권고사항" },
];

export default function BriefingSections({ briefing }: Props) {
  return (
    <div className="space-y-4">
      {SECTIONS.map(({ key, title }) => {
        const text = briefing[key];
        if (!text) return null;
        return (
          <div key={key}>
            <h4 className="text-sm font-bold text-navy-950 mb-1.5">{title}</h4>
            <MarkdownBriefing text={text} />
          </div>
        );
      })}
      {briefing.korea_perspective && (
        <div>
          <h4 className="text-sm font-bold text-navy-950 mb-1.5">한국 입장</h4>
          <MarkdownBriefing text={briefing.korea_perspective} />
        </div>
      )}
      {briefing.counterpart_perspective && (
        <div>
          <h4 className="text-sm font-bold text-navy-950 mb-1.5">상대국 입장</h4>
          <MarkdownBriefing text={briefing.counterpart_perspective} />
        </div>
      )}
    </div>
  );
}
