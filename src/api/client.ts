import type { QueryResult, UserType } from "../types";
import { buildMockChatAnswer, getMockAgent1, getMockAgent34 } from "./mock";

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
  briefing: string;
  agent1_data: import("../types").Agent1Response;
}

interface QueryApiError {
  error: string;
}

async function postQuery(userInput: string, userType: UserType): Promise<QueryApiChat | QueryApiReport | QueryApiError> {
  const res = await fetch(`${API_BASE_URL}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_input: userInput, user_type: USER_TYPE_KO[userType] }),
    signal: AbortSignal.timeout(20000), // LLM 호출 포함이라 단순 API보다 여유 있게
  });
  if (!res.ok) throw new Error(`/query API error: ${res.status}`);
  return res.json();
}

/**
 * 일반 사용자: Agent 1 + LLM 챗봇 답변 (Agent 2~4 미사용)
 * 기업·연구자: Agent 1~4 전체 파이프라인 → 보고서 (Agent 2~4는 아직 구현 전이라 정량 지표는 목업으로 보강)
 * 백엔드 연결 실패 시 전체를 목업으로 대체해 오프라인 개발이 가능하게 한다.
 */
export async function fetchResult(userType: UserType, question: string, fallbackCountry: string): Promise<QueryResult> {
  try {
    const raw = await postQuery(question, userType);

    if ("error" in raw) throw new Error(raw.error);

    if (raw.type === "chat") {
      return { type: "chat", country: raw.country, answer: raw.answer, agent1: raw.data, isAgent1Mocked: false };
    }

    return {
      type: "report",
      country: raw.country,
      agent1: raw.agent1_data,
      // summary_text는 실제 Agent 1 데이터 기반 LLM 브리핑(진짜), 나머지 정량 지표는 Agent 2~4 미구현으로 목업
      agent34: { ...getMockAgent34(raw.country), summary_text: raw.briefing },
      isAgent1Mocked: false,
      isReportMocked: true,
    };
  } catch {
    const country = fallbackCountry;
    const agent1 = getMockAgent1(country);

    if (userType === "individual") {
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
      agent1,
      agent34: getMockAgent34(country),
      isAgent1Mocked: true,
      isReportMocked: true,
    };
  }
}
