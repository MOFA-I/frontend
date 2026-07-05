import { Sparkles } from "lucide-react";

interface Props {
  question: string;
  answer: string;
}

export default function ChatAnswerCard({ question, answer }: Props) {
  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card space-y-4">
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-navy-900 text-white text-sm px-4 py-2.5 leading-relaxed">
          {question}
        </div>
      </div>
      <div className="flex items-start gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-500 ring-1 ring-gold-500/30">
          <Sparkles size={15} />
        </span>
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-navy-100 bg-navy-50/60 px-4 py-3 text-sm text-navy-900 leading-relaxed whitespace-pre-wrap">
          {answer}
        </div>
      </div>
    </div>
  );
}
