import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShieldAlert,
  Stamp,
  AlertTriangle,
  Clock,
  Gauge,
  Handshake,
  TrendingUp,
  Globe2,
  Landmark,
  Info,
} from "lucide-react";
import Header from "../components/Header";
import Section from "../components/Section";
import TravelWarningBadge from "../components/TravelWarningBadge";
import CountryMapPlaceholder from "../components/CountryMapPlaceholder";
import MarkdownBriefing from "../components/MarkdownBriefing";
import ChatAnswerCard from "../components/ChatAnswerCard";
import SafetyNoticeList from "../components/SafetyNoticeList";
import SecurityEnvironmentPanel from "../components/SecurityEnvironmentPanel";
import TimelineList from "../components/TimelineList";
import VisaCard from "../components/VisaCard";
import RiskGauge from "../components/RiskGauge";
import CooperationIndex from "../components/CooperationIndex";
import OpportunityBarChart from "../components/OpportunityBarChart";
import SimilarCountryCards from "../components/SimilarCountryCards";
import OdaTrendChart from "../components/OdaTrendChart";
import { COUNTRIES } from "../api/countries";
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

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  if (!state?.result) {
    return <Navigate to="/" replace />;
  }

  const { userType, question, result } = state;
  const { agent1, country } = result;
  const isoCode = result.type === "report" ? result.agent34.country_iso_code : (COUNTRIES.find((c) => c.name === country)?.iso ?? "—");

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
              {result.isAgent1Mocked ? (
                <span className="flex items-center gap-1 text-xs font-medium text-gold-500/90 rounded-full bg-gold-100 px-2.5 py-1">
                  <Info size={11} /> 목업 데이터 (백엔드 미연동)
                </span>
              ) : (
                result.type === "report" &&
                result.isReportMocked && (
                  <span className="flex items-center gap-1 text-xs font-medium text-gold-500/90 rounded-full bg-gold-100 px-2.5 py-1">
                    <Info size={11} /> 정량 지표는 목업 (Agent 2~4 준비 중)
                  </span>
                )
              )}
            </div>
            <h1 className="text-2xl font-bold text-navy-950 tracking-tight">{country} 브리핑</h1>
            <p className="text-sm text-navy-700/50 mt-1">"{question}"</p>
          </div>
          <TravelWarningBadge level={agent1.travel_warning_level} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            {result.type === "chat" ? (
              <>
                <ChatAnswerCard question={question} answer={result.answer} />
                <Section icon={AlertTriangle} title="최근 안전공지" subtitle="외교부 해외안전여행 공지사항 기준">
                  <SafetyNoticeList notices={agent1.recent_safety_notices} />
                </Section>
                <Section icon={Clock} title="현지 주요 정세 타임라인">
                  <TimelineList situations={agent1.recent_situations} />
                </Section>
              </>
            ) : (
              <>
                <Section icon={Info} title="AI 브리핑 요약">
                  <MarkdownBriefing text={result.agent34.summary_text} />
                </Section>

                {userType === "corporate" && (
                  <>
                    <Section icon={TrendingUp} title="협력 기회 분야 랭킹" subtitle="산업 분야별 기회 점수 (0-100)">
                      <OpportunityBarChart scores={result.agent34.opportunity_scores} />
                    </Section>
                    <Section icon={Globe2} title="유사 국가 추천" subtitle="리스크·기회 패턴이 유사한 국가">
                      <SimilarCountryCards countries={result.agent34.similar_countries} />
                    </Section>
                  </>
                )}

                {userType === "researcher" && (
                  <Section icon={TrendingUp} title="ODA 트렌드" subtitle="연도별 공적개발원조 규모 (백만 달러)">
                    <OdaTrendChart data={result.agent34.oda_trend ?? []} />
                  </Section>
                )}

                <Section
                  icon={Landmark}
                  title={userType === "researcher" ? "외교 타임라인" : "현지 주요 정세 타임라인"}
                >
                  <TimelineList situations={agent1.recent_situations} />
                </Section>

                <Section icon={AlertTriangle} title="최근 안전공지">
                  <SafetyNoticeList notices={agent1.recent_safety_notices} />
                </Section>
              </>
            )}
          </div>

          <div className="space-y-5">
            {result.type === "report" && (
              <>
                <CountryMapPlaceholder country={country} isoCode={isoCode} />
                <Section icon={Gauge} title="진출 리스크 스코어">
                  <RiskGauge score={result.agent34.risk_score} />
                </Section>
                <Section icon={Handshake} title="협력 지수">
                  <CooperationIndex index={result.agent34.cooperation_index} />
                </Section>
              </>
            )}

            <Section icon={ShieldAlert} title="치안환경 지표">
              <SecurityEnvironmentPanel data={agent1.security_environment} />
            </Section>

            <Section icon={Stamp} title="입국 허가요건 (일반여권 기준)">
              <VisaCard visa={agent1.entrance_visa} />
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
