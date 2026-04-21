import type { ReactNode } from "react";

export default function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="prose-apple max-w-[720px] mx-auto">
      <style>{`
        .prose-apple { font-size: 17px; line-height: 1.58; letter-spacing: -0.022em; color: rgba(0,0,0,0.8); }
        .prose-apple > * + * { margin-top: 1.2em; }
        .prose-apple h2 { font-size: 32px; line-height: 1.125; letter-spacing: -0.003em; color: #1d1d1f; font-weight: 600; margin-top: 2.4em; }
        .prose-apple h3 { font-size: 24px; line-height: 1.17; letter-spacing: -0.003em; color: #1d1d1f; font-weight: 600; margin-top: 1.8em; }
        .prose-apple strong { color: #1d1d1f; font-weight: 600; }
        .prose-apple code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.875em; background: #f5f5f7; padding: 0.125rem 0.4rem; border-radius: 4px; color: #1d1d1f; }
        .prose-apple pre { background: #f5f5f7; border-radius: 12px; padding: 1.25rem; overflow-x: auto; }
        .prose-apple pre code { background: transparent; padding: 0; }
        .prose-apple ul, .prose-apple ol { padding-left: 1.5rem; }
        .prose-apple li { margin: 0.5em 0; }
        .prose-apple a { color: #0066cc; text-decoration: none; }
        .prose-apple a:hover { text-decoration: underline; text-underline-offset: 2px; }
      `}</style>
      {children}
    </div>
  );
}
