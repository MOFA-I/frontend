import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, Compass, Database, ScanSearch, Calculator, FileText, MessageCircleMore } from "lucide-react";
import { fetchResult } from "../api/client";
import type { QueryResult, UserType } from "../types";

interface LocationState {
  userType: UserType;
  question: string;
  country: string;
}

const CHAT_STEPS = [
  { icon: Database, label: "Agent 1 · 외교부 공공데이터 수집", detail: "여행경보·안전공지·비자·정세 5종 API 조회" },
  { icon: MessageCircleMore, label: "AI 답변 생성", detail: "공식 데이터를 바탕으로 질문에 맞는 답변 작성" },
];

const REPORT_STEPS = [
  { icon: Database, label: "Agent 1 · 외교부 공공데이터 수집", detail: "여행경보·안전공지·비자·정세 5종 API 조회" },
  { icon: ScanSearch, label: "Agent 2 · 이슈 분석", detail: "질문 의도 파악 및 핵심 이슈 추출" },
  { icon: Calculator, label: "Agent 3 · 정량 스코어링", detail: "리스크 점수·협력 지수·기회 분야 산출" },
  { icon: FileText, label: "Agent 4 · 보고서 생성", detail: "역할 맞춤형 브리핑 문서 작성" },
];

const MIN_DISPLAY_MS = 3600;

export default function Loading() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const [stepIndex, setStepIndex] = useState(0);
  const startedAt = useRef(Date.now());

  const steps = state?.userType === "individual" ? CHAT_STEPS : REPORT_STEPS;

  useEffect(() => {
    if (!state?.country) {
      navigate("/", { replace: true });
      return;
    }

    let cancelled = false;
    const stepTimer = setInterval(() => {
      setStepIndex((i) => (i < steps.length - 1 ? i + 1 : i));
    }, 850);

    async function run() {
      const result = await fetchResult(state!.userType, state!.question, state!.country);
      const elapsed = Date.now() - startedAt.current;
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
      setTimeout(() => {
        if (!cancelled) {
          setStepIndex(steps.length - 1);
          setTimeout(() => {
            if (!cancelled)
              navigate("/result", { replace: true, state: { ...state, result } as { result: QueryResult } & LocationState });
          }, 350);
        }
      }, remaining);
    }
    run();

    return () => {
      cancelled = true;
      clearInterval(stepTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!state?.country) return null;

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <div className="relative flex items-center justify-center h-16 w-16 mb-5">
            <span className="absolute inset-0 rounded-full border border-gold-500/40 animate-pulse-ring" />
            <span className="absolute inset-0 rounded-full border border-gold-500/40 animate-pulse-ring [animation-delay:0.6s]" />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/15 text-gold-400 ring-1 ring-gold-500/40">
              <Compass size={26} />
            </span>
          </div>
          <p className="text-white font-semibold text-lg">{state.country} 브리핑 생성 중</p>
          <p className="text-navy-100/50 text-sm mt-1">
            잠시만 기다려주세요 · {steps.length}단계 에이전트 파이프라인 실행 중
          </p>
        </div>

        <div className="space-y-3">
          {steps.map((step, i) => {
            const status = i < stepIndex ? "done" : i === stepIndex ? "active" : "pending";
            const Icon = step.icon;
            return (
              <div
                key={step.label}
                className={`flex items-center gap-3.5 rounded-xl border px-4 py-3.5 transition-all duration-300 ${
                  status === "pending"
                    ? "border-navy-800 opacity-40"
                    : status === "active"
                      ? "border-gold-500/40 bg-navy-900"
                      : "border-navy-800 bg-navy-900/60"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    status === "done"
                      ? "bg-risk-safe/20 text-risk-safe"
                      : status === "active"
                        ? "bg-gold-500/20 text-gold-400"
                        : "bg-navy-800 text-navy-100/40"
                  }`}
                >
                  {status === "done" ? <Check size={16} /> : <Icon size={16} />}
                </span>
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${status === "pending" ? "text-navy-100/40" : "text-white"}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-navy-100/40 truncate">{step.detail}</p>
                </div>
                {status === "active" && (
                  <span className="ml-auto flex gap-1 shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-bounce" />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
