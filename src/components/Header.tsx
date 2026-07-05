import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-navy-950/95 backdrop-blur border-b border-navy-800">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gold-500/15 text-gold-400 ring-1 ring-gold-500/30 group-hover:ring-gold-500/60 transition">
            <Compass size={18} strokeWidth={2} />
          </span>
          <span className="text-white font-semibold tracking-tight text-[15px]">
            MOFA <span className="text-gold-400">Intelligence</span>
          </span>
        </Link>
        <span className="hidden sm:block text-xs text-navy-100/60 tracking-wide">
          외교부 공공데이터 기반 AI 외교 인텔리전스 플랫폼
        </span>
      </div>
      <div className="h-[2px] bg-gradient-to-r from-gold-500 via-gold-400/60 to-transparent" />
    </header>
  );
}
