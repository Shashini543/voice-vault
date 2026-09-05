import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

const components: Components = {
  h1: ({ children }) => (
    <h1 className="mb-3 mt-6 text-xl font-bold text-white light:text-slate-900 first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2 mt-5 text-lg font-bold text-white light:text-slate-900 first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-4 text-base font-semibold text-white light:text-slate-900 first:mt-0">{children}</h3>
  ),
  p: ({ children }) => <p className="mb-3 text-sm leading-6 text-slate-300 light:text-slate-700">{children}</p>,
  ul: ({ children }) => <ul className="mb-3 ml-5 list-disc space-y-1.5 text-sm text-slate-300 light:text-slate-700">{children}</ul>,
  ol: ({ children }) => (
    <ol className="mb-3 ml-5 list-decimal space-y-1.5 text-sm text-slate-300 light:text-slate-700">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-6">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-white light:text-slate-900">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  hr: () => <hr className="my-4 border-slate-800 light:border-slate-200" />,
  blockquote: ({ children }) => (
    <blockquote className="mb-3 border-l-2 border-indigo-500 pl-3 text-sm italic text-slate-400 light:text-slate-500">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded bg-slate-800 light:bg-slate-100 px-1.5 py-0.5 text-xs text-indigo-300 light:text-indigo-700">
      {children}
    </code>
  ),
};

export function Markdown({ content }: { content: string }) {
  return (
    <div className="max-w-none">
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}
