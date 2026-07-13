import { Info } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function InfoTooltip({ children }: Props) {
  return (
    <span className="group relative inline-flex">
      <Info size={13} className="text-navy-700/40 hover:text-navy-700/70 cursor-help" />
      <span
        className="pointer-events-none absolute right-0 top-full z-10 mt-1.5 w-56 rounded-lg bg-navy-950 px-3 py-2 text-[11px] leading-relaxed text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
      >
        {children}
      </span>
    </span>
  );
}
