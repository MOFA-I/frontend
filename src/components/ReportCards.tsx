import type { ReportCard } from "../types";
import RiskGauge from "./RiskGauge";
import CooperationIndex from "./CooperationIndex";
import StatCard from "./StatCard";
import InfoTooltip from "./InfoTooltip";

interface Props {
  cards: ReportCard[];
  riskComponents?: [string, number][];
}

const VERDICT_TONE: Record<string, string> = {
  추천: "bg-risk-safe/15 text-risk-safe ring-risk-safe/30",
  관망: "bg-risk-caution/15 text-[#8a6d1f] ring-risk-caution/30",
  비추천: "bg-risk-danger/15 text-risk-danger ring-risk-danger/30",
};

const COOP_FORMULA = "협력등급은 무역규모(30%)·ODA 누적액(30%)·교민수(20%)·수교연도(20%)를 종합해 5단계로 환산됩니다.";

function EntryVerdictCard({ card }: { card: ReportCard }) {
  const tone = VERDICT_TONE[String(card.value)] ?? "bg-navy-100 text-navy-700 ring-navy-200";
  return (
    <div>
      <p className="text-xs text-navy-700/50 mb-2">{card.label}</p>
      <span className={`inline-flex items-center rounded-full px-4 py-1.5 text-base font-bold ring-1 ${tone}`}>{card.value}</span>
      {card.confidence != null && <p className="text-xs text-navy-700/50 mt-2">확신도 {Math.round(card.confidence * 100)}%</p>}
      {card.grounds && card.grounds.length > 0 && (
        <ul className="mt-2 space-y-0.5 text-xs text-navy-700/60 list-disc pl-4">
          {card.grounds.map((g, i) => (
            <li key={i}>{g}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ReportCards({ cards, riskComponents }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
      {cards.map((card) => (
        <div key={card.id} className="relative flex flex-col justify-center rounded-xl border border-navy-100 px-4 py-3.5 bg-navy-50/40">
          {(card.id === "risk" || card.id === "coop_grade" || card.id === "coop_index") && (
            <span className="absolute top-3 right-3">
              <InfoTooltip>
                {card.id === "risk"
                  ? riskComponents && riskComponents.length > 0
                    ? `위험도 세부 요인 — ${riskComponents.map(([label, value]) => `${label} ${value}점`).join(" · ")}`
                    : "여행경보·안전공지 빈도·정치 이슈 리스크를 가중합산해 산출됩니다."
                  : COOP_FORMULA}
              </InfoTooltip>
            </span>
          )}
          {card.id === "entry_verdict" ? (
            <EntryVerdictCard card={card} />
          ) : card.id === "risk" ? (
            <RiskGauge score={Number(card.value)} color={card.color} sub={card.sub} />
          ) : card.id === "coop_grade" ? (
            <CooperationIndex grade={Number(card.value)} sub={card.sub} />
          ) : (
            <StatCard label={card.label} value={card.value} max={card.max} sub={card.sub} color={card.color} />
          )}
        </div>
      ))}
    </div>
  );
}
