import ReactMarkdown from "react-markdown";

interface Props {
  text: string;
}

export default function MarkdownBriefing({ text }: Props) {
  return (
    <div className="text-sm leading-relaxed text-navy-800">
      <ReactMarkdown
        components={{
          h1: (p) => (
            <h1 className="text-base font-bold text-navy-950 mb-3 pb-2 border-b border-navy-100" {...p} />
          ),
          h2: (p) => <h2 className="text-sm font-bold text-navy-950 mb-1.5 mt-4 first:mt-0" {...p} />,
          h3: (p) => <h3 className="text-sm font-semibold text-navy-950 mb-1.5" {...p} />,
          p: (p) => <p className="mb-3 last:mb-0" {...p} />,
          strong: (p) => <strong className="font-semibold text-navy-950" {...p} />,
          em: (p) => <em className="not-italic text-xs text-navy-700/50" {...p} />,
          ul: (p) => <ul className="list-disc pl-5 mb-3 space-y-1" {...p} />,
          li: (p) => <li {...p} />,
          hr: () => <hr className="my-4 border-t border-navy-100" />,
          a: (p) => (
            <a
              className="text-gold-500 underline decoration-gold-500/40 underline-offset-2 hover:text-gold-400"
              target="_blank"
              rel="noopener noreferrer"
              {...p}
            />
          ),
          blockquote: (p) => (
            <blockquote className="border-l-2 border-gold-500 pl-3 text-navy-700/70 text-xs italic my-3" {...p} />
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
