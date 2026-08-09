import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShieldAlert,
  Stamp,
  AlertTriangle,
  Clock,
  Gauge,
  TrendingUp,
  Globe2,
  Landmark,
  Info,
} from "lucide-react";
import Header from "../components/Header";
import Section from "../components/Section";
import TravelWarningBadge from "../components/TravelWarningBadge";
import ChatAnswerCard from "../components/ChatAnswerCard";
import SafetyNoticeList from "../components/SafetyNoticeList";
import SecurityEnvironmentPanel from "../components/SecurityEnvironmentPanel";
import TimelineList from "../components/TimelineList";
import VisaCard from "../components/VisaCard";
import ReportCards from "../components/ReportCards";
import BriefingSections from "../components/BriefingSections";
import RankedBarChart from "../components/RankedBarChart";
import RiskVsCoopScatter from "../components/RiskVsCoopScatter";
import OdaTrendChart from "../components/OdaTrendChart";
import ReportMap from "../components/ReportMap";
import type { QueryResult, UserType } from "../types";

interface LocationState {
  userType: UserType;
  question: string;
  country: string;
  result: QueryResult;
}

const USER_TYPE_LABEL: Record<UserType, string> = {
  individual: "👤 일반 사용자",
  corporate: "🏢 기업",
  researcher: "🏛️ 연구자·공공기관",
};

interface TravelAlertFeature {
  country: string;
  alert_level: number;
  alert_label: string;
}

const CHART_ICON: Record<string, typeof TrendingUp> = {
  risk_vs_coop: Gauge,
  risk_components: TrendingUp,
  similar_countries: Globe2,
  oda_trend: TrendingUp,
  diplomatic_timeline: Landmark,
};

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  if (!state?.result) {
    return <Navigate to="/" replace />;
  }

  const { userType, question, result } = state;
  const { country } = result;

  if (result.type === "refused") {
    return (
      <div className="min-h-screen bg-navy-50 flex flex-col">
        <Header />
        <div className="mx-auto w-full max-w-2xl px-6 py-20 flex-1 text-center">
          <p className="text-navy-950 text-lg font-semibold mb-2">답변드릴 수 없는 질문이에요</p>
          <p className="text-navy-700/60 text-sm mb-8">{result.message}</p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-700 hover:text-navy-950 transition"
          >
            <ArrowLeft size={14} /> 새로운 질문하기
          </button>
        </div>
      </div>
    );
  }

  const reportTravelLevel =
    result.type === "report"
      ? (() => {
          const layer = result.report.map.layers.find((l) => l.id === "travel_alert");
          const feature = (layer?.features as unknown as TravelAlertFeature[] | undefined)?.find((f) => f.country === country);
          return feature ? `${feature.alert_level}단계 ${feature.alert_label}` : null;
        })()
      : null;

  return (
    <div className="min-h-screen bg-navy-50 flex flex-col">
      <Header />

      <div className="mx-auto w-full max-w-6xl px-6 py-6 flex-1">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-xs text-navy-700/60 hover:text-navy-950 mb-4 transition"
        >
          <ArrowLeft size={14} /> 새로운 질문하기
        </button>

        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-medium text-navy-700/50 rounded-full bg-navy-100 px-2.5 py-1">
                {USER_TYPE_LABEL[userType]}
              </span>
              {result.type === "chat" && result.isAgent1Mocked ? (
                <span className="flex items-center gap-1 text-xs font-medium text-gold-500/90 rounded-full bg-gold-100 px-2.5 py-1">
                  <Info size={11} /> 목업 데이터 (백엔드 미연동)
                </span>
              ) : (
                result.type === "report" &&
                result.isReportMocked && (
                  <span className="flex items-center gap-1 text-xs font-medium text-gold-500/90 rounded-full bg-gold-100 px-2.5 py-1">
                    <Info size={11} /> 목업 데이터 (백엔드 미연동)
                  </span>
                )
              )}
            </div>
            <h1 className="text-2xl font-bold text-navy-950 tracking-tight">{country} 브리핑</h1>
            <p className="text-sm text-navy-700/50 mt-1">"{question}"</p>
          </div>
          <TravelWarningBadge level={result.type === "chat" ? result.agent1.travel_warning_level : reportTravelLevel} />
        </div>

        {result.type === "chat" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-5">
              <ChatAnswerCard question={question} answer={result.answer} />
              <Section icon={AlertTriangle} title="최근 안전공지" subtitle="외교부 해외안전여행 공지사항 기준">
                <SafetyNoticeList notices={result.agent1.recent_safety_notices} />
              </Section>
              <Section icon={Clock} title="현지 주요 정세 타임라인">
                <TimelineList situations={result.agent1.recent_situations} />
              </Section>
            </div>
            <div className="space-y-5">
              <Section icon={ShieldAlert} title="치안환경 지표">
                <SecurityEnvironmentPanel data={result.agent1.security_environment} />
              </Section>
              <Section icon={Stamp} title="입국 허가요건 (일반여권 기준)">
                <VisaCard visa={result.agent1.entrance_visa} />
              </Section>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <Section icon={Gauge} title="핵심 지표">
              <ReportCards
                cards={result.report.cards}
                riskComponents={result.report.dashboard.charts.find((c) => c.id === "risk_components")?.data as [string, number][] | undefined}
              />
            </Section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 space-y-5">
                <Section icon={Info} title="AI 종합 브리핑">
                  <BriefingSections briefing={result.report.briefing} />
                </Section>

                {result.report.dashboard.charts.map((chart) => {
                  const Icon = CHART_ICON[chart.id] ?? TrendingUp;
                  if (chart.id === "risk_vs_coop") {
                    return (
                      <Section key={chart.id} icon={Icon} title={chart.title}>
                        <RiskVsCoopScatter data={chart.data as { country: string; x: number; y: number; grade: number }[]} />
                      </Section>
                    );
                  }
                  if (chart.id === "risk_components") {
                    return (
                      <Section key={chart.id} icon={Icon} title={chart.title}>
                        <RankedBarChart data={chart.data as [string, number][]} valueLabel="점수" />
                      </Section>
                    );
                  }
                  if (chart.id === "similar_countries") {
                    return (
                      <Section key={chart.id} icon={Icon} title={chart.title}>
                        <RankedBarChart
                          data={chart.data as [string, number][]}
                          domain={[0, 1]}
                          valueLabel="유사도"
                          valueFormatter={(v) => `${Math.round(v * 100)}%`}
                          note="위험도·협력지수·기회지수를 종합한 코사인 유사도(0~1)입니다."
                        />
                      </Section>
                    );
                  }
                  if (chart.id === "oda_trend") {
                    const d = chart.data as { years: number[]; values: number[] };
                    return (
                      <Section key={chart.id} icon={Icon} title={chart.title}>
                        <OdaTrendChart years={d.years} values={d.values} />
                      </Section>
                    );
                  }
                  if (chart.id === "diplomatic_timeline") {
                    const d = chart.data as { events: { date: string; event: string; kind?: "milestone" | "recent" | "notice" }[] };
                    return (
                      <Section key={chart.id} icon={Icon} title={chart.title}>
                        <TimelineList situations={d.events} />
                      </Section>
                    );
                  }
                  return null;
                })}
              </div>

              <div className="space-y-5">
                <Section icon={Globe2} title="지리공간 분석">
                  <ReportMap map={result.report.map} />
                </Section>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
