import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  emoji: string;
  title: string;
  description: string;
  bullets: string[];
  selected: boolean;
  onSelect: () => void;
}

export default function UserTypeCard({ icon: Icon, emoji, title, description, bullets, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`text-left w-full rounded-2xl border p-6 transition-all duration-200 ${
        selected
          ? "border-navy-700 bg-navy-900 shadow-card-hover -translate-y-0.5"
          : "border-navy-100 bg-white hover:border-navy-500/40 hover:shadow-card"
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${
            selected ? "bg-gold-500/15 text-gold-400 ring-1 ring-gold-500/40" : "bg-navy-100 text-navy-700"
          }`}
        >
          <Icon size={20} strokeWidth={2} />
        </span>
        <div>
          <div className={`text-xs font-medium ${selected ? "text-gold-400" : "text-navy-500"}`}>
            {emoji} {title.split(" ")[0]}
          </div>
          <div className={`font-semibold ${selected ? "text-white" : "text-navy-950"}`}>{title}</div>
        </div>
      </div>
      <p className={`text-sm mb-4 leading-relaxed ${selected ? "text-navy-100/70" : "text-navy-700/70"}`}>
        {description}
      </p>
      <ul className="space-y-1.5">
        {bullets.map((b) => (
          <li
            key={b}
            className={`text-xs flex items-start gap-1.5 ${selected ? "text-navy-100/60" : "text-navy-700/60"}`}
          >
            <span className={`mt-1 h-1 w-1 shrink-0 rounded-full ${selected ? "bg-gold-400" : "bg-navy-500"}`} />
            {b}
          </li>
        ))}
      </ul>
    </button>
  );
}
