import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Building2, Landmark, Search, ArrowRight, ShieldCheck, BarChart3, Sparkles } from "lucide-react";
import Header from "../components/Header";
import UserTypeCard from "../components/UserTypeCard";
import { extractCountry } from "../api/countries";
import type { UserType } from "../types";

const USER_TYPES: {
  type: UserType;
  emoji: string;
  icon: typeof User;
  title: string;
  description: string;
  bullets: string[];
  examples: string[];
}[] = [
  {
    type: "individual",
    emoji: "👤",
    icon: User,
    title: "일반 사용자",
    description: "여행·체류 전 알아야 할 정보를 한 번에 확인하세요.",
    bullets: ["여행경보 단계", "비자·입국 요건", "현지 안전공지·정세"],
    examples: ["일본 여행 가도 안전할까?", "태국 무비자 입국 조건 알려줘", "필리핀 최근 치안 어때?"],
  },
  {
    type: "corporate",
    emoji: "🏢",
    icon: Building2,
    title: "기업",
    description: "해외 진출 의사결정에 필요한 정량 리스크 지표를 제공합니다.",
    bullets: ["진출 리스크 스코어카드", "경쟁국 비교", "협력 기회 분야 분석"],
    examples: ["베트남 진출 리스크 알려줘", "인도네시아 협력 지수 분석해줘", "말레이시아와 태국 중 어디가 유리할까?"],
  },
  {
    type: "researcher",
    emoji: "🏛️",
    icon: Landmark,
    title: "연구자·공공기관",
    description: "외교 타임라인과 ODA 트렌드를 근거 기반으로 정리합니다.",
    bullets: ["외교 타임라인", "ODA 트렌드", "정책 브리핑 요약"],
    examples: ["우크라이나 관련 최근 외교 타임라인 정리해줘", "몽골 ODA 트렌드 알려줘", "이집트 정책 브리핑 만들어줘"],
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType | null>(null);
  const [question, setQuestion] = useState("");

  const detected = useMemo(() => extractCountry(question), [question]);
  const canSubmit = userType !== null && detected !== null;

  function handleSubmit() {
    if (!canSubmit || !detected || !userType) return;
    navigate("/loading", { state: { userType, question, country: detected.name } });
  }

  const activeType = USER_TYPES.find((t) => t.type === userType);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="bg-navy-950 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 60% 70%, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-24 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs font-medium text-gold-400 mb-5">
            <Sparkles size={12} /> 외교부 공식 데이터 기반 실시간 분석
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            국가명이나 외교 이슈를 물어보세요
          </h1>
          <p className="text-navy-100/60 text-sm sm:text-base max-w-xl mx-auto">
            AI가 외교부 공식 데이터를 실시간으로 분석해, 사용자 역할에 맞는 브리핑 보고서를 자동으로 생성합니다.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg mx-auto text-navy-100/50 text-xs">
            <div className="flex flex-col items-center gap-1.5">
              <ShieldCheck size={16} className="text-gold-400" />
              신뢰성 · 공식 데이터
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <BarChart3 size={16} className="text-gold-400" />
              정량 분석 · 객관 지표
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Search size={16} className="text-gold-400" />
              전 분석 근거 공개
            </div>
          </div>
        </div>
      </section>

      <main className="relative flex-1 mx-auto w-full max-w-6xl px-6 -mt-10 pb-20">
        <div className="rounded-2xl bg-white shadow-card-hover border border-navy-100 p-6 sm:p-8">
          <h2 className="text-sm font-semibold text-navy-950 mb-1">1. 어떤 목적으로 방문하셨나요?</h2>
          <p className="text-xs text-navy-700/60 mb-5">역할에 따라 브리핑 보고서의 구성과 지표가 달라집니다.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {USER_TYPES.map((t) => (
              <UserTypeCard
                key={t.type}
                icon={t.icon}
                emoji={t.emoji}
                title={t.title}
                description={t.description}
                bullets={t.bullets}
                selected={userType === t.type}
                onSelect={() => setUserType(t.type)}
              />
            ))}
          </div>

          <h2 className="text-sm font-semibold text-navy-950 mb-1">2. 궁금한 국가나 이슈를 질문해주세요</h2>
          <p className="text-xs text-navy-700/60 mb-4">
            {activeType ? `예: ${activeType.examples[0]}` : "먼저 위에서 목적을 선택해주세요"}
          </p>

          <div
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
              userType ? "border-navy-500/40 bg-navy-50" : "border-navy-100 bg-navy-50/50 opacity-60"
            }`}
          >
            <Search size={18} className="text-navy-500 shrink-0" />
            <input
              disabled={!userType}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder={activeType ? activeType.examples[0] : "목적을 먼저 선택하세요"}
              className="flex-1 bg-transparent outline-none text-sm text-navy-950 placeholder:text-navy-700/40 disabled:cursor-not-allowed"
            />
            {detected && (
              <span className="hidden sm:inline-flex items-center rounded-md bg-navy-900 text-white text-xs px-2 py-1 font-medium shrink-0">
                {detected.name} 인식됨
              </span>
            )}
          </div>

          {activeType && (
            <div className="flex flex-wrap gap-2 mt-3">
              {activeType.examples.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setQuestion(ex)}
                  className="text-xs rounded-full border border-navy-100 px-3 py-1.5 text-navy-700/70 hover:border-navy-500/40 hover:text-navy-950 transition"
                >
                  {ex}
                </button>
              ))}
            </div>
          )}

          {question && !detected && (
            <p className="text-xs text-risk-danger mt-3">
              질문에서 국가명을 찾지 못했습니다. 국가명을 포함해 질문해주세요. (데모 지원 국가 기준)
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="mt-6 w-full sm:w-auto sm:ml-auto sm:flex flex items-center justify-center gap-2 rounded-xl bg-navy-950 text-white text-sm font-semibold px-6 py-3 hover:bg-navy-900 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            브리핑 생성하기
            <ArrowRight size={16} />
          </button>
        </div>
      </main>
    </div>
  );
}
