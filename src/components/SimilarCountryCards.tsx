import { Globe2 } from "lucide-react";

interface Props {
  countries: string[];
}

export default function SimilarCountryCards({ countries }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {countries.map((c) => (
        <div key={c} className="flex items-center gap-2.5 rounded-xl border border-navy-100 px-3.5 py-3 bg-navy-50/40">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-100 text-navy-700 shrink-0">
            <Globe2 size={15} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-navy-950 truncate">{c}</p>
            <p className="text-[11px] text-navy-700/50">유사 리스크·기회 패턴</p>
          </div>
        </div>
      ))}
    </div>
  );
}
