import type { ReactNode } from "react";

export default function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="prose-lux max-w-[720px] mx-auto">
      <style>{`
        .prose-lux { font-size: 16px; line-height: 1.7; color: rgba(21,24,26,0.72); }
        .prose-lux > * + * { margin-top: 1.1em; }
        .prose-lux h2 { font-size: 26px; line-height: 1.15; letter-spacing: -.022em; color: #15181a; font-weight: 600; margin-top: 2em; }
        .prose-lux h3 { font-size: 19px; line-height: 1.25; letter-spacing: -.015em; color: #15181a; font-weight: 600; margin-top: 1.6em; }
        .prose-lux strong { color: #15181a; font-weight: 600; }
        .prose-lux code {
          font-family: ui-monospace, SFMono-Regular, monospace;
          font-size: 0.875em;
          background: rgba(21,24,26,0.05);
          border: 1px solid rgba(21,24,26,0.08);
          padding: 0.125rem 0.4rem;
          border-radius: 4px;
          color: #507918;
        }
        .prose-lux pre {
          background: #0f1310;
          border: 1px solid #1e2519;
          border-radius: 10px;
          padding: 1.1rem 1.25rem;
          overflow-x: auto;
        }
        .prose-lux pre code { background: transparent; border: none; padding: 0; color: #e6efe2; }
        .prose-lux ul, .prose-lux ol { padding-left: 1.4rem; }
        .prose-lux li { margin: 0.45em 0; }
        .prose-lux a { color: #507918; text-decoration: none; border-bottom: 1px solid rgba(80,121,24,0.35); }
        .prose-lux a:hover { border-bottom-color: #507918; }
        .prose-lux hr { border: 0; border-top: 1px solid rgba(21,24,26,0.08); margin: 2.5em 0; }
      `}</style>
      {children}
    </div>
  );
}
