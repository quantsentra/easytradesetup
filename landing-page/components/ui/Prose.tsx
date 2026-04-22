import type { ReactNode } from "react";

export default function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="prose-lux max-w-[720px] mx-auto">
      <style>{`
        .prose-lux { font-size: 16px; line-height: 1.65; color: rgba(237,241,250,0.72); }
        .prose-lux > * + * { margin-top: 1.2em; }
        .prose-lux h2 { font-size: 30px; line-height: 1.12; letter-spacing: -.025em; color: #EDF1FA; font-weight: 600; margin-top: 2.4em; }
        .prose-lux h3 { font-size: 22px; line-height: 1.2; letter-spacing: -.02em; color: #EDF1FA; font-weight: 600; margin-top: 1.8em; }
        .prose-lux strong { color: #EDF1FA; font-weight: 600; }
        .prose-lux code {
          font-family: ui-monospace, SFMono-Regular, monospace;
          font-size: 0.875em;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 0.125rem 0.4rem;
          border-radius: 4px;
          color: #22D3EE;
        }
        .prose-lux pre {
          background: rgba(3,6,20,.7);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 1.25rem;
          overflow-x: auto;
        }
        .prose-lux pre code { background: transparent; border: none; padding: 0; color: #EDF1FA; }
        .prose-lux ul, .prose-lux ol { padding-left: 1.5rem; }
        .prose-lux li { margin: 0.5em 0; }
        .prose-lux a { color: #4E9AFF; text-decoration: none; }
        .prose-lux a:hover { text-decoration: underline; text-underline-offset: 3px; color: #22D3EE; }
        .prose-lux hr { border: 0; border-top: 1px solid rgba(255,255,255,0.08); margin: 2.5em 0; }
      `}</style>
      {children}
    </div>
  );
}
