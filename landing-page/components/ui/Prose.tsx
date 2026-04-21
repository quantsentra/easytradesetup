import type { ReactNode } from "react";

export default function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="prose-custom max-w-3xl">
      <style>{`
        .prose-custom { font-size: 17px; line-height: 1.75; color: #b8b2a8; }
        .prose-custom > * + * { margin-top: 1.25em; }
        .prose-custom h2 { font-family: var(--font-display); font-size: 2rem; color: #f5f0e8; margin-top: 2.5em; letter-spacing: -0.02em; }
        .prose-custom h3 { font-family: var(--font-display); font-size: 1.5rem; color: #f5f0e8; margin-top: 2em; }
        .prose-custom strong { color: #f5f0e8; font-weight: 600; }
        .prose-custom code { font-family: var(--font-mono); font-size: 0.875em; background: #1a1a1a; padding: 0.125rem 0.375rem; border-radius: 0.25rem; color: #d4a648; }
        .prose-custom pre { background: #141414; border: 1px solid #262626; border-radius: 0.75rem; padding: 1.25rem; overflow-x: auto; }
        .prose-custom pre code { background: transparent; color: #f5f0e8; padding: 0; }
        .prose-custom ul, .prose-custom ol { padding-left: 1.5rem; }
        .prose-custom li { margin: 0.5em 0; }
        .prose-custom a { color: #d4a648; text-decoration: underline; text-underline-offset: 3px; }
      `}</style>
      {children}
    </div>
  );
}
