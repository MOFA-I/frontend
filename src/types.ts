export type UserType = "individual" | "corporate" | "researcher";

export interface SafetyNotice {
  date: string | null;
  title: string | null;
  summary: string | null;
}

export interface SecurityEnvironment {
  current_travel_alarm: string | null;
  unemployment_rate: number | null;
  suicide_death_rate: number | null;
}

export interface RecentSituation {
  date: string | null;
  event: string | null;
}

export interface EntranceVisa {
  general_passport_visa_required: string | null;
  general_passport_visa_note: string | null;
}

/** Agent 1 응답 (외교부 5종 API 통합 분석) — 실제 백엔드 스키마와 동일 */
export interface Agent1Response {
  country: string;
  travel_warning_level: string | null;
  recent_safety_notices: SafetyNotice[];
  security_environment: SecurityEnvironment;
  recent_situations: RecentSituation[];
  entrance_visa: EntranceVisa;
}

/** Agent 3·4 응답 — 아직 미구현, 목업으로 대체 */
export interface Agent34Response {
  summary_text: string;
  risk_score: number;
  cooperation_index: number;
  opportunity_scores: Record<string, number>;
  similar_countries: string[];
  country_iso_code: string;
  oda_trend?: { year: number; amount_million_usd: number }[];
}

/** 일반 사용자 경로: Agent 1 + LLM 챗봇 답변 (Agent 2~4 미사용) */
export interface ChatQueryResult {
  type: "chat";
  country: string;
  answer: string;
  agent1: Agent1Response;
  isAgent1Mocked: boolean;
}

/** 기업·연구자 경로: Agent 1~4 전체 파이프라인 → 보고서 */
export interface ReportQueryResult {
  type: "report";
  country: string;
  agent1: Agent1Response;
  agent34: Agent34Response;
  isAgent1Mocked: boolean;
  /** Agent 2~4가 아직 구현되지 않아 정량 지표는 항상 목업임을 표시 */
  isReportMocked: boolean;
}

export type QueryResult = ChatQueryResult | ReportQueryResult;

export interface OnboardingRequest {
  userType: UserType;
  question: string;
  country: string;
}
