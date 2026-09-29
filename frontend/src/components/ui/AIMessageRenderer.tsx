"use client";

import { memo, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 px-2 py-1 rounded-md text-[11px] font-medium transition-all opacity-0 group-hover:opacity-100"
      style={{
        backgroundColor: "var(--color-sage)",
        color: "var(--color-text-secondary)",
        border: "1px solid var(--color-border-light)",
      }}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function preprocessContent(content: string): string {
  let cleaned = content
    .replace(/\\u2019/g, "'")
    .replace(/\\u2018/g, "'")
    .replace(/\\u201c/g, '"')
    .replace(/\\u201d/g, '"')
    .replace(/\\u2014/g, " — ")
    .replace(/\\u2013/g, " – ")
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "  ");

  cleaned = cleaned.replace(/\\([^\\`*_\[\]()>~|#{\-+.!])/g, "$1");

  return cleaned.trim();
}

const markdownComponents = {
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-[20px] font-bold mt-6 mb-3 leading-tight" style={{ color: "var(--color-text)" }} {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-[17px] font-bold mt-5 mb-2.5 leading-tight" style={{ color: "var(--color-text)" }} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-[15px] font-semibold mt-4 mb-2 leading-tight" style={{ color: "var(--color-text)" }} {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="text-[14px] font-semibold mt-3 mb-1.5 leading-tight" style={{ color: "var(--color-text)" }} {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-[13px] leading-[1.7] mb-3" style={{ color: "var(--color-text)" }} {...props}>
      {children}
    </p>
  ),
  strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold" style={{ color: "var(--color-text)" }} {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <em className="italic" {...props}>{children}</em>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc pl-5 mb-3 space-y-1" style={{ color: "var(--color-text)" }} {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal pl-5 mb-3 space-y-1" style={{ color: "var(--color-text)" }} {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-[13px] leading-[1.7]" style={{ color: "var(--color-text)" }} {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 pl-4 py-2 my-3 rounded-r-lg"
      style={{
        borderColor: "var(--color-primary)",
        backgroundColor: "var(--color-sage-light)",
        color: "var(--color-text-secondary)",
      }}
      {...props}
    >
      {children}
    </blockquote>
  ),
  a: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline font-medium hover:opacity-80 transition-opacity"
      style={{ color: "var(--color-primary)" }}
      {...props}
    >
      {children}
    </a>
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-4 border-0 h-px" style={{ backgroundColor: "var(--color-border)" }} {...props} />
  ),
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-3 overflow-x-auto rounded-lg border" style={{ borderColor: "var(--color-border)" }}>
      <table className="w-full text-[12px] border-collapse" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead style={{ backgroundColor: "var(--color-sage)" }} {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody {...props}>{children}</tbody>
  ),
  tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="border-b last:border-b-0" style={{ borderColor: "var(--color-border-light)" }} {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="px-3 py-2 text-left font-semibold whitespace-nowrap"
      style={{ color: "var(--color-text)", borderColor: "var(--color-border-light)" }}
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className="px-3 py-2"
      style={{ color: "var(--color-text)", borderColor: "var(--color-border-light)" }}
      {...props}
    >
      {children}
    </td>
  ),
  code: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="px-1.5 py-0.5 rounded text-[12px] font-mono"
          style={{
            backgroundColor: "var(--color-sage)",
            color: "var(--color-primary-dark)",
          }}
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    const codeChild = children as React.ReactElement<{ children?: string }>;
    const codeText =
      typeof codeChild?.props?.children === "string"
        ? codeChild.props.children
        : typeof children === "string"
          ? children
          : "";
    return (
      <div className="relative group my-3 rounded-lg overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
        <div
          className="flex items-center justify-between px-3 py-1.5 text-[11px]"
          style={{ backgroundColor: "var(--color-sage)", color: "var(--color-text-secondary)" }}
        >
          <span className="font-medium">Code</span>
        </div>
        <pre
          className="p-4 overflow-x-auto text-[12px] leading-relaxed font-mono"
          style={{
            backgroundColor: "var(--color-card)",
            color: "var(--color-text)",
          }}
          {...props}
        >
          {children}
        </pre>
        {codeText && <CopyButton text={codeText} />}
      </div>
    );
  },
};

interface AIMessageRendererProps {
  content: string;
  className?: string;
}

function AIMessageRendererInner({ content, className }: AIMessageRendererProps) {
  const processed = preprocessContent(content);

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={markdownComponents}
      >
        {processed}
      </ReactMarkdown>
    </div>
  );
}

const AIMessageRenderer = memo(AIMessageRendererInner);
export default AIMessageRenderer;
