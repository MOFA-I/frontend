import { Briefcase, HeartPulse, ShieldAlert } from "lucide-react";
import type { SecurityEnvironment } from "../types";

interface Props {
  data: SecurityEnvironment;
}

export default function SecurityEnvironmentPanel({ data }: Props) {
  const travelAlarm = data.current_travel_alarm;
  const colonIndex = travelAlarm?.indexOf(":") ?? -1;
  const alarmLevel = colonIndex >= 0 ? travelAlarm!.slice(0, colonIndex).trim() : travelAlarm;
  const alarmDetail = colonIndex >= 0 ? travelAlarm!.slice(colonIndex + 1).trim() : undefined;

  const items = [
    {
      icon: ShieldAlert,
      label: "현재 여행경보",
      value: travelAlarm ? (
        <>
          {alarmLevel}
          {alarmDetail && (
            <>
              :<br />
              {alarmDetail}
            </>
          )}
        </>
      ) : (
        "정보 없음"
      ),
    },
    {
      icon: Briefcase,
      label: "실업률",
      value: data.unemployment_rate != null ? `${data.unemployment_rate}%` : "정보 없음",
    },
    {
      icon: HeartPulse,
      label: "자살률 (인구 10만명당)",
      value: data.suicide_death_rate != null ? `${data.suicide_death_rate}명` : "정보 없음",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-stretch">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col rounded-xl border border-navy-100 px-4 py-3.5 bg-navy-50/40"
        >
          <div className="flex items-center gap-1.5 text-navy-700/50 mb-1.5 min-h-[2rem]">
            <item.icon size={13} className="shrink-0" />
            <span className="text-[11px] leading-snug">{item.label}</span>
          </div>
          <p className="text-sm font-bold text-navy-950 leading-snug">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
