import type { Agent1Response, Agent4Output } from "../types";
import { COUNTRIES } from "./countries";

// 백엔드(orchestrator)에 연결할 수 없을 때 일반 사용자 챗봇 답변을 대체할 목업
export function buildMockChatAnswer(country: string, question: string, agent1: Agent1Response): string {
  // 외교부 EntranceVisaService2 원본 필드 규칙: yn은 레코드 존재 여부라 항상 "Y"에 가깝고 실질 신호가 아님.
  // cn(내용)이 실제 일수 등 내용이면 그만큼 무비자, 문자 그대로 "X"면 사증(비자) 필요.
  const note = agent1.entrance_visa.general_passport_visa_note;
  const visaLine =
    note && note !== "X" ? `무비자로 ${note} 체류가 가능해요.` : `사증(비자)이 필요해요. 발급 조건은 공식 공지를 확인해보세요.`;

  return (
    `"${question}"에 대해 외교부 공식 데이터를 바탕으로 안내드릴게요.\n\n` +
    `${country}의 현재 여행경보는 '${agent1.travel_warning_level ?? "정보 없음"}' 단계예요. ` +
    `최근에는 "${agent1.recent_safety_notices[0]?.title ?? "특이 공지 없음"}"과 같은 안전공지가 있었으니 출국 전 확인해보세요.\n\n` +
    `입국 요건은 ${visaLine}\n\n` +
    `더 자세한 사항은 외교부 해외안전여행 홈페이지에서 최신 공지를 확인하시길 권장해요.`
  );
}

const WARNING_LEVELS = ["1단계 남색경보(여행유의)", "2단계 황색경보(여행자제)", "3단계 적색경보(철수권고)"];

// 국가명을 시드로 사용해 일관된 목업 수치를 생성 (새로고침해도 같은 나라는 같은 값)
function seedFromString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function getMockAgent1(country: string): Agent1Response {
  const seed = seedFromString(country);
  const warningLevel = WARNING_LEVELS[seed % WARNING_LEVELS.length];

  return {
    country,
    travel_warning_level: warningLevel,
    recent_safety_notices: [
      {
        date: "2026-06-28",
        title: `${country} 일부 지역 치안 강화 안내`,
        summary: `${country} 현지 공관은 최근 발생한 정세 변화와 관련하여 재외국민에 대한 안전 유의를 당부했습니다.`,
      },
      {
        date: "2026-06-14",
        title: `${country} 자연재해 대비 안전공지`,
        summary: `우기·계절적 요인으로 인한 자연재해 가능성에 대비해 현지 공지사항을 상시 확인할 것을 권고했습니다.`,
      },
      {
        date: "2026-05-30",
        title: `${country} 대규모 집회 관련 유의사항`,
        summary: `현지 주요 도시에서 예정된 집회·시위와 관련해 해당 지역 방문을 자제할 것을 안내했습니다.`,
      },
    ],
    security_environment: {
      current_travel_alarm: warningLevel,
      unemployment_rate: Number(((seed % 12) + 2.1).toFixed(1)),
      suicide_death_rate: Number(((seed % 20) + 5.3).toFixed(1)),
    },
    recent_situations: [
      { date: "2026-06-30", event: `${country} 정부, 대외 협력 강화 방안 발표` },
      { date: "2026-06-10", event: `${country}-한국 경제 실무협의체 개최` },
      { date: "2026-05-22", event: `${country} 주요 도시 인프라 투자 계획 승인` },
      { date: "2026-04-18", event: `${country} 대선/총선 관련 정치 일정 발표` },
    ],
    // 실제 외교부 API 원본 형식에 맞춘 목업: yn은 항상 "Y"(레코드 존재 여부일 뿐), 실질 신호는 note
    entrance_visa: {
      general_passport_visa_required: "Y",
      general_passport_visa_note: seed % 3 === 0 ? "X" : `${30 + (seed % 4) * 30}일`,
    },
  };
}

// AI/report_generator/geo.py의 COUNTRY_COORDS 일부 재사용 (지도 목업용)
const COUNTRY_COORDS: Record<string, [number, number]> = {
  베트남: [14.0583, 108.2772],
  인도네시아: [-0.7893, 113.9213],
  태국: [15.87, 100.9925],
  필리핀: [12.8797, 121.774],
  몽골: [46.8625, 103.8467],
  말레이시아: [4.2105, 101.9758],
  캄보디아: [12.5657, 104.991],
  라오스: [19.8563, 102.4955],
  미얀마: [21.9162, 95.956],
  인도: [20.5937, 78.9629],
  카자흐스탄: [48.0196, 66.9237],
  사우디아라비아: [23.8859, 45.0792],
  아랍에미리트: [23.4241, 53.8478],
  이집트: [26.8206, 30.8025],
  우크라이나: [48.3794, 31.1656],
  중국: [35.8617, 104.1954],
  일본: [36.2048, 138.2529],
  미국: [37.0902, -95.7129],
  튀르키예: [38.9637, 35.2433],
};
const KOREA_COORDS: [number, number] = [36.5, 127.9];

const REPORT_TYPE = { 기업: "Business Intelligence Report", 연구자: "Policy & Research Brief" } as const;
const RISK_COMPONENT_LABELS = ["여행경보", "안전공지 빈도", "사회지표"];

// AI/report_generator/schemas.py의 Agent4Output과 동일한 구조를 만드는 오프라인/폴백용 목업.
// 기업·연구자별 조건부 필드는 백엔드(cards.py/dashboard.py/map_layers.py)의 분기와 1:1로 맞춰둠.
export function getMockReport(country: string, target: "기업" | "연구자"): Agent4Output {
  const seed = seedFromString(country);
  const risk = 20 + (seed % 70);
  const coopScore = Number((1 + ((seed >> 3) % 40) / 10).toFixed(1));
  const coopGrade = Math.min(5, Math.max(1, Math.round(coopScore / 2)));
  const centerXy = COUNTRY_COORDS[country] ?? ([20, 100] as [number, number]);

  const similarPool = COUNTRIES.filter((c) => c.name !== country).map((c) => c.name);
  const similarCountries: [string, number][] = [
    [similarPool[seed % similarPool.length], Number((0.6 + ((seed % 30) / 100)).toFixed(3))],
    [similarPool[(seed + 7) % similarPool.length], Number((0.5 + ((seed % 25) / 100)).toFixed(3))],
  ];

  const verdict: string = risk < 40 && coopGrade >= 3 ? "추천" : risk > 70 ? "비추천" : "관망";

  const cards: Agent4Output["cards"] =
    target === "기업"
      ? [
          {
            id: "entry_verdict",
            label: "진출 판정",
            value: verdict,
            confidence: 0.6 + ((seed % 30) / 100),
            grounds: [`위험도 ${risk.toFixed(1)}/100`, `협력등급 ${coopGrade}/5`, `주요 위험요인: ${RISK_COMPONENT_LABELS[seed % 3]} ${40 + (seed % 50)}점`],
            sub: null,
            color: null,
            max: null,
          },
          {
            id: "risk",
            label: "위험도",
            value: Number(risk.toFixed(1)),
            max: 100,
            color: risk < 40 ? "#2e7d32" : risk < 70 ? "#f9a825" : "#c62828",
            sub: "경보 1단계 기준",
            confidence: null,
            grounds: null,
          },
          {
            id: "coop_grade",
            label: "협력등급",
            value: coopGrade,
            max: 5,
            sub: `Cooperation Index ${coopScore}`,
            color: null,
            confidence: null,
            grounds: null,
          },
        ]
      : [
          {
            id: "risk",
            label: "위험도",
            value: Number(risk.toFixed(1)),
            max: 100,
            color: risk < 40 ? "#2e7d32" : risk < 70 ? "#f9a825" : "#c62828",
            sub: "경보 1단계 기준",
            confidence: null,
            grounds: null,
          },
          {
            id: "coop_index",
            label: "Cooperation Index",
            value: coopScore,
            max: null,
            sub: `${coopGrade}등급/5`,
            color: null,
            confidence: null,
            grounds: null,
          },
        ];

  const layers: Agent4Output["map"]["layers"] = [
    {
      id: "travel_alert",
      source_agent: "agent1",
      type: "alert_markers",
      title: "여행경보",
      features: [{ country, lat: centerXy[0], lon: centerXy[1], alert_level: 1 + (seed % 3), alert_label: "여행자제", partial: seed % 2 === 0 }],
    },
    {
      id: "oda_summary",
      source_agent: "agent2",
      type: "agg_markers",
      title: "KOICA ODA 현황",
      features: [{ country, lat: centerXy[0], lon: centerXy[1], cumulative_usd_million: 50 + (seed % 300) }],
    },
    {
      id: "korea_orgs",
      source_agent: "agent2",
      type: "agg_markers",
      title: "한국기관 진출",
      features: [
        {
          country,
          lat: centerXy[0],
          lon: centerXy[1],
          count: 2,
          orgs: [
            { name: `KOTRA ${country}무역관`, org_type: "무역진흥기관" },
            { name: `한국국제협력단 ${country}사무소`, org_type: "공적개발원조기관" },
          ],
        },
      ],
    },
  ];
  if (target === "기업") {
    layers.push({
      id: "trade_flow",
      source_agent: "agent2",
      type: "arc",
      title: "무역 흐름",
      features: [{ from: KOREA_COORDS, to: centerXy, label: `한-${country} 교역`, value_usd_million: 500 + (seed % 5000) }],
    });
  } else {
    layers.push({
      id: "similarity_lines",
      source_agent: "agent3",
      type: "similarity_lines",
      title: `${country} 유사국가`,
      features: similarCountries.map(([name, sim]) => ({
        from: centerXy,
        to: COUNTRY_COORDS[name] ?? [20, 100],
        label: `${country} ↔ ${name}`,
        similarity: sim,
        target_country: name,
      })),
    });
  }

  const charts: Agent4Output["dashboard"]["charts"] = [
    {
      id: "risk_vs_coop",
      source_agent: "agent3",
      type: "scatter",
      title: "위험도 vs 협력지수",
      data: [{ country, x: risk, y: coopScore, grade: coopGrade }],
    },
    {
      id: "risk_components",
      source_agent: "agent3",
      type: "bar",
      title: `${country} 위험도 구성요인`,
      data: RISK_COMPONENT_LABELS.map((label, i) => [label, Number((20 + ((seed >> i) % 60)).toFixed(1))]),
    },
    {
      id: "similar_countries",
      source_agent: "agent3",
      type: "bar",
      title: target === "기업" ? "대안 국가 (유사도)" : "유사 외교 패턴 국가",
      data: similarCountries,
    },
    {
      id: "oda_trend",
      source_agent: "agent2",
      type: "line",
      title: `${country} ODA 지원실적 연도별 추이 (백만$)`,
      data: {
        years: [2022, 2023, 2024, 2025, 2026],
        values: [2022, 2023, 2024, 2025, 2026].map((_, i) => 12 + ((seed >> i) % 40) + i * 3),
      },
    },
  ];
  if (target === "연구자") {
    charts.push({
      id: "diplomatic_timeline",
      source_agent: "agent1+agent2",
      type: "timeline",
      title: `${country} 외교·안전 타임라인`,
      data: {
        events: [
          { date: "1992", event: `한-${country} 수교`, kind: "milestone" },
          { date: "2026-06-30", event: `${country} 정부, 대외 협력 강화 방안 발표`, kind: "recent" },
          { date: "2026-06-28", event: `${country} 일부 지역 치안 강화 안내`, kind: "notice" },
        ],
      },
    });
  }

  return {
    meta: {
      report_type: REPORT_TYPE[target],
      target,
      countries: [country],
      user_query: "",
      generated_at: new Date().toISOString(),
      llm_model: "mock",
      pipeline_version: "1.2",
    },
    briefing: {
      executive_summary: `${country}은(는) 최근 대외 관계 및 정세 변화에 따라 한국과의 협력 여지가 있는 지역으로 분석됩니다.`,
      situation_analysis: `외교부 공식 데이터 기준 ${country}의 현재 여행경보와 치안 지표는 안정적인 수준이며, 최근 정세 변화가 관측되고 있습니다.`,
      risk_analysis: `위험도는 100점 만점에 ${risk.toFixed(1)}점으로, 여행경보·안전공지 빈도·사회지표를 종합한 결과입니다.`,
      opportunity_analysis: `협력지수는 ${coopScore}점(${coopGrade}등급)으로 산출되었으며, ODA 지원실적과 교역 규모를 근거로 합니다.`,
      recommendation: target === "기업" ? `현재 지표 기준 진출 판정은 '${verdict}'입니다.` : `정책 참고 목적의 분석 결과이며, 최신 공지사항을 상시 확인하는 것을 권장합니다.`,
      korea_perspective: `한국 입장에서 ${country}은(는) 공급망·인프라 협력 확대가 가능한 대상국입니다.`,
      counterpart_perspective: `${country} 입장에서는 한국과의 기술·투자 협력 확대에 관심이 있는 것으로 분석됩니다.`,
    },
    cards,
    map: { center: centerXy, zoom: 5, layers },
    dashboard: { charts },
    evidence: [
      { agent: "Agent 1 · Issue Analyzer", source: "외교부 여행경보·안전정보·치안환경·주요정세·비자 API", action: `${country} 현황 조회`, at: new Date().toISOString() },
      { agent: "Agent 2 · Intelligence Collector", source: "외교부 관계·무역 API + KOICA·해외진출 CSV", action: `[${country}] 수집: 외교관계 API, 무역관계 API, KOICA ODA 연도별`, at: new Date().toISOString() },
      { agent: "Agent 3 · Insight Generator", source: "pandas + scikit-learn", action: "위험도·협력지수·유사국가 산출", at: new Date().toISOString() },
      { agent: "Agent 4 · Report Generator", source: "mock", action: "타깃별 브리핑 생성 · 지도/차트는 결정적 계산(LLM 미개입)", at: new Date().toISOString() },
    ],
    files: { html: null, pdf: null },
  };
}
