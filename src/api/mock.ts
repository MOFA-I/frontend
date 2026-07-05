import type { Agent1Response, Agent34Response } from "../types";
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

export function getMockAgent34(country: string): Agent34Response {
  const seed = seedFromString(country);
  const iso = COUNTRIES.find((c) => c.name === country)?.iso ?? "KR";

  const fields = ["AI·반도체", "제조업", "의료·바이오", "친환경 에너지", "금융"];
  const opportunity_scores: Record<string, number> = {};
  fields.forEach((f, i) => {
    opportunity_scores[f] = 40 + ((seed >> i) % 55);
  });

  const similarPool = COUNTRIES.filter((c) => c.name !== country).map((c) => c.name);
  const similar_countries = [similarPool[seed % similarPool.length], similarPool[(seed + 7) % similarPool.length]];

  const oda_trend = [2022, 2023, 2024, 2025, 2026].map((year, i) => ({
    year,
    amount_million_usd: 12 + ((seed >> i) % 40) + i * 3,
  }));

  return {
    summary_text:
      `## ${country} 브리핑 요약\n\n` +
      `${country}은(는) 최근 대외 관계 및 정세 변화에 따라 **한국과의 협력 여지가 있는 지역**으로 분석됩니다. ` +
      `외교부 공식 데이터 기준 현재 여행경보와 치안 지표는 아래와 같으며, 산업 협력 관점에서는 ` +
      `${Object.entries(opportunity_scores).sort((a, b) => b[1] - a[1])[0][0]} 분야의 기회 점수가 가장 높게 나타났습니다.\n\n` +
      `> 본 요약은 Agent 1(공공데이터 수집)과 Agent 3·4(정량 스코어링·보고서 생성)의 결과를 결합해 자동 생성되었습니다.`,
    risk_score: 20 + (seed % 70),
    cooperation_index: 1 + (seed % 5),
    opportunity_scores,
    similar_countries,
    country_iso_code: iso,
    oda_trend,
  };
}
