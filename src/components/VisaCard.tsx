import { Stamp } from "lucide-react";
import type { EntranceVisa } from "../types";

interface Props {
  visa: EntranceVisa;
}

/**
 * 외교부 입국허가요건 API(EntranceVisaService2) 원본 필드 해석.
 * gnrl_pspt_visa_yn은 레코드 존재 여부라 값이 있으면 거의 항상 "Y"이고 (이란·아프가니스탄·수단처럼
 * 비자가 반드시 필요한 국가에서도 "Y") 실질적인 신호가 아니다. 실제 비자 필요 여부는
 * gnrl_pspt_visa_cn(내용)에 담겨 있다: 일수 등 실제 내용이 있으면 그만큼 무비자 체류 가능,
 * 문자 그대로 "X"면 무비자 조건이 없어 사증(비자)이 필요하다는 뜻 (여러 국가 실데이터로 교차 확인).
 */
export default function VisaCard({ visa }: Props) {
  const note = visa.general_passport_visa_note;
  const isVisaFree = !!note && note !== "X";
  const isVisaRequired = note === "X";

  const label = isVisaFree ? "무비자 입국 가능" : isVisaRequired ? "사증(비자) 필요" : "정보 없음";

  return (
    <div className="rounded-xl border border-navy-100 p-4 bg-navy-50/40">
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            isVisaFree ? "bg-risk-safe/15 text-risk-safe" : "bg-navy-100 text-navy-700"
          }`}
        >
          <Stamp size={15} />
        </span>
        <p className="text-sm font-bold text-navy-950">{label}</p>
      </div>
      {isVisaFree && <p className="text-xs text-navy-700/60 leading-relaxed">{note} 체류 가능</p>}
    </div>
  );
}
