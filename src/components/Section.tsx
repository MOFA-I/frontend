import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export default function Section({ icon: Icon, title, subtitle, children, className = "" }: Props) {
  return (
    <div className={`rounded-2xl border border-navy-100 bg-white p-5 shadow-card ${className}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy-100 text-navy-700">
          <Icon size={14} />
        </span>
        <h3 className="text-sm font-bold text-navy-950">{title}</h3>
      </div>
      {subtitle && <p className="text-xs text-navy-700/50 mb-4 ml-9">{subtitle}</p>}
      {!subtitle && <div className="mb-3" />}
      {children}
    </div>
  );
}
