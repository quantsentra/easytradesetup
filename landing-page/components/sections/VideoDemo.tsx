"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";

type ConnectionLike = {
  saveData?: boolean;
  effectiveType?: string;
};

function shouldAutoplay(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return false;
  } catch {
    /* ignored */
  }

  try {
    const nav = navigator as Navigator & { connection?: ConnectionLike };
    const conn = nav.connection;
    if (conn) {
      if (conn.saveData) return false;
      const slow = conn.effectiveType && /2g|slow-2g/.test(conn.effectiveType);
      if (slow) return false;
    }
  } catch {
    /* ignored */
  }

  return true;
}

export default function VideoDemo() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [autoplayOk, setAutoplayOk] = useState(false);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    setAutoplayOk(shouldAutoplay());
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (typeof IntersectionObserver === "undefined") {
      setNearViewport(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setNearViewport(true);
            if (!autoplayOk) return;
            const vid = videoRef.current;
            if (vid && vid.readyState < 2) vid.load();
            if (vid) vid.play().catch(() => undefined);
          }
        }
      },
      { rootMargin: "1200px 0px 1200px 0px", threshold: 0.01 },
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [autoplayOk]);

  function toggleMute() {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
    if (!el.muted && el.paused) el.play().catch(() => undefined);
  }

  function togglePlay() {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => undefined);
    } else {
      el.pause();
    }
  }

  return (
    <section className="relative above-bg overflow-hidden" ref={wrapRef}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[400px] opacity-50"
        style={{
          background:
            "radial-gradient(900px 300px at 50% 0%, rgba(43,123,255,0.15), transparent 60%)",
        }}
      />

      <div className="container-wide relative py-14 sm:py-20 md:py-24">
        <SectionHeader
          eyebrow="See it in action"
          title={<>The indicator. <span className="grad-text-2">Live on the chart.</span></>}
          lede="Watch how regime, structure, and key levels draw themselves in real time."
        />

        <div className="mt-8 sm:mt-12 md:mt-14 relative mx-auto max-w-[920px]">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-6 sm:-inset-10 rounded-[32px] opacity-60"
            style={{
              background:
                "radial-gradient(600px 200px at 50% 100%, rgba(43,123,255,0.25), transparent 70%)",
              filter: "blur(20px)",
            }}
          />

          <figure className="relative glass-card overflow-hidden">
            <div className="flex items-center justify-between gap-2 px-3 sm:px-5 py-2.5 sm:py-3 border-b border-rule" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="flex items-center gap-1.5 flex-shrink-0" aria-hidden>
                <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#FF5F57]" />
                <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#FEBC2E]" />
                <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex-1 text-nano sm:text-micro text-ink-40 truncate px-2 sm:px-3 font-mono text-center uppercase tracking-widest">
                Golden Indicator · Live demo
              </div>
              <div className="inline-flex items-center gap-1 sm:gap-1.5 bg-white/5 px-2 py-0.5 rounded-md border border-rule-2 flex-shrink-0">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-cyan motion-safe:animate-pulse"
                  style={{ boxShadow: "0 0 6px #22D3EE" }}
                  aria-hidden
                />
                <span className="text-nano font-bold text-cyan uppercase tracking-widest">
                  1.5×
                </span>
              </div>
            </div>

            <div className="relative bg-black">
              <video
                ref={videoRef}
                src={nearViewport && autoplayOk ? "/demo.mp4" : undefined}
                poster="/chart-after.png"
                autoPlay={autoplayOk}
                muted
                loop
                playsInline
                preload={autoplayOk ? "auto" : "none"}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onCanPlay={(e) => {
                  const el = e.currentTarget;
                  el.playbackRate = 1.5;
                  if (autoplayOk && el.paused) el.play().catch(() => undefined);
                }}
                onClick={togglePlay}
                className="w-full h-auto block cursor-pointer"
                aria-label="Golden Indicator live demo — regime, structure, key levels drawn on a Gold 15m chart. Sped up 1.5x, muted, looping."
              />

              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? "Unmute demo" : "Mute demo"}
                className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 inline-flex items-center gap-1.5 bg-black/65 hover:bg-black/80 text-white backdrop-blur rounded-full px-3 py-2 text-nano font-semibold uppercase tracking-widest transition-colors min-h-[36px]"
              >
                {muted ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M11 5L6 9H2v6h4l5 4V5z" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                    Unmute
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M11 5L6 9H2v6h4l5 4V5z" />
                      <path d="M15.54 8.46a5 5 0 010 7.07" />
                      <path d="M19.07 4.93a10 10 0 010 14.14" />
                    </svg>
                    Mute
                  </>
                )}
              </button>

              {!playing && (
                <button
                  type="button"
                  onClick={() => {
                    setAutoplayOk(true);
                    togglePlay();
                  }}
                  aria-label="Play demo"
                  className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                >
                  <span
                    className="flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-full text-[#0B0F17] shadow-cta"
                    style={{ background: "linear-gradient(135deg, #4E9AFF, #22D3EE)" }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </button>
              )}
            </div>

            <figcaption className="sr-only">
              Golden Indicator rendered live on a Gold / USD 15-minute chart. Playback sped up 1.5x, muted by default, looping.
            </figcaption>
          </figure>

          <p className="mt-4 text-nano font-mono uppercase tracking-widest text-ink-40 text-center px-2">
            {autoplayOk
              ? "Muted · Looping · Playback 1.5× · Illustrative · Not a trade recommendation"
              : "Tap play to load · Data-saver / reduced-motion respected · Illustrative"}
          </p>
        </div>
      </div>
    </section>
  );
}
