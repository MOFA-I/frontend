import type { Agent4Output, QueryResult, UserType } from "../types";
import { buildMockChatAnswer, getMockAgent1, getMockReport } from "./mock";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

// orchestrator/router.py 의 user_type 리터럴과 맞춘 매핑
const USER_TYPE_KO: Record<UserType, string> = {
  individual: "일반사용자",
  corporate: "기업",
  researcher: "연구자",
};

interface QueryApiChat {
  type: "chat";
  country: string;
  answer: string;
  data: import("../types").Agent1Response;
}

interface QueryApiReport {
  type: "report";
  country: string;
  report: Agent4Output;
}

interface QueryApiRefused {
  type: "refused";
  reason: string | null;
  message: string;
}

interface QueryApiError {
  error: string;
}

async function postQuery(userInput: string, userType: UserType): Promise<QueryApiChat | QueryApiReport | QueryApiRefused | QueryApiError> {
  const res = await fetch(`${API_BASE_URL}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_input: userInput, user_type: USER_TYPE_KO[userType] }),
    // Render 무료 플랜은 유휴 상태에서 깨어나는 데 50초 이상 걸릴 수 있어 여유 있게 설정
    signal: AbortSignal.timeout(60000),
  });
  if (!res.ok) throw new Error(`/query API error: ${res.status}`);
  return res.json();
}

/**
 * 일반 사용자: Agent 1 + LLM 챗봇 답변 (Agent 2~4 미사용)
 * 기업·연구자: Agent 1~4 전체 파이프라인 → 보고서 (report 객체를 그대로 전달)
 * 백엔드 연결 실패 시 전체를 목업으로 대체해 오프라인 개발이 가능하게 한다.
 */
export async function fetchResult(userType: UserType, question: string, fallbackCountry: string): Promise<QueryResult> {
  try {
    const raw = await postQuery(question, userType);

    if ("error" in raw) throw new Error(raw.error);

    if (raw.type === "refused") {
      return { type: "refused", country: fallbackCountry, message: raw.message };
    }

    if (raw.type === "chat") {
      return { type: "chat", country: raw.country, answer: raw.answer, agent1: raw.data, isAgent1Mocked: false };
    }

    return {
      type: "report",
      country: raw.country,
      report: raw.report,
      isReportMocked: false,
    };
  } catch {
    const country = fallbackCountry;

    if (userType === "individual") {
      const agent1 = getMockAgent1(country);
      return {
        type: "chat",
        country,
        answer: buildMockChatAnswer(country, question, agent1),
        agent1,
        isAgent1Mocked: true,
      };
    }

    return {
      type: "report",
      country,
      report: getMockReport(country, USER_TYPE_KO[userType] as "기업" | "연구자"),
      isReportMocked: true,
    };
  }
}
