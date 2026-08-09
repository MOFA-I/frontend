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

/** 일반 사용자 경로: Agent 1 + LLM 챗봇 답변 (Agent 2~4 미사용) */
export interface ChatQueryResult {
  type: "chat";
  country: string;
  answer: string;
  agent1: Agent1Response;
  isAgent1Mocked: boolean;
}

/** Agent 4 출력 — report_generator/schemas.py Agent4Output과 1:1 대응 (wire format 그대로 snake_case) */
export interface ReportBriefing {
  executive_summary: string;
  situation_analysis: string;
  risk_analysis: string;
  opportunity_analysis: string;
  recommendation: string;
  korea_perspective: string | null;
  counterpart_perspective: string | null;
}

export interface ReportCard {
  id: string;
  label: string;
  value: string | number;
  sub: string | null;
  color: string | null;
  max: number | null;
  confidence: number | null;
  grounds: string[] | null;
}

/** features/data의 세부 shape는 각 소비 컴포넌트에서 로컬 타입으로 정의 (Pydantic도 dict/list로 느슨하게 타입됨) */
export interface ReportMapLayer {
  id: string;
  source_agent: string;
  type: string;
  title: string;
  features: Record<string, unknown>[];
}

export interface ReportMapBlock {
  center: [number, number];
  zoom: number;
  layers: ReportMapLayer[];
}

export interface ReportChart {
  id: string;
  source_agent: string;
  type: string;
  title: string;
  data: unknown;
}

export interface ReportEvidenceEntry {
  agent: string;
  source: string;
  action: string;
  at: string | null;
}

export interface ReportMeta {
  report_type: string;
  target: "기업" | "연구자";
  countries: string[];
  user_query: string;
  generated_at: string;
  llm_model: string;
  pipeline_version: string;
}

export interface Agent4Output {
  meta: ReportMeta;
  briefing: ReportBriefing;
  cards: ReportCard[];
  map: ReportMapBlock;
  dashboard: { charts: ReportChart[] };
  evidence: ReportEvidenceEntry[];
  files: { html: string | null; pdf: string | null };
}

/** 기업·연구자 경로: Agent 1~4 전체 파이프라인 → 보고서 (agent1 데이터는 report 응답에 포함되지 않음) */
export interface ReportQueryResult {
  type: "report";
  country: string;
  report: Agent4Output;
  isReportMocked: boolean;
}

/** 가드레일에 의해 답변이 거절된 경우 */
export interface RefusedQueryResult {
  type: "refused";
  country: string;
  message: string;
}

export type QueryResult = ChatQueryResult | ReportQueryResult | RefusedQueryResult;

export interface OnboardingRequest {
  userType: UserType;
  question: string;
  country: string;
}
