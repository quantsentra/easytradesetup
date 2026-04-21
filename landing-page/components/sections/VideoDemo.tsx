"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";

export default function VideoDemo() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const vid = videoRef.current;
    if (!wrap || !vid) return;
    vid.playbackRate = 1.5;
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
  }, []);

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
    <section className="relative bg-page overflow-hidden" ref={wrapRef}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[400px] opacity-60"
        style={{
          background:
            "radial-gradient(900px 300px at 50% 0%, rgba(0,113,227,0.08), transparent 60%)",
        }}
      />

      <div className="container-wide relative py-14 sm:py-20 md:py-28">
        <SectionHeader
          eyebrow="See it in action"
          title={<>The indicator. Live on the chart.</>}
          lede="Watch how regime, structure, and key levels draw themselves in real time."
        />

        <div className="mt-8 sm:mt-12 md:mt-14 relative mx-auto max-w-[920px]">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-6 sm:-inset-10 rounded-[32px] opacity-60"
            style={{
              background:
                "radial-gradient(600px 200px at 50% 100%, rgba(0,113,227,0.16), transparent 70%)",
            }}
          />

          <figure className="relative rounded-[16px] sm:rounded-[22px] overflow-hidden bg-surface shadow-card">
            <div className="flex items-center justify-between gap-2 px-3 sm:px-5 py-2.5 sm:py-3 border-b border-rule">
              <div className="flex items-center gap-1.5 flex-shrink-0" aria-hidden>
                <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e]" />
                <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 text-nano sm:text-micro text-muted-faint truncate px-2 sm:px-3 font-mono text-center">
                Golden Indicator · Live demo
              </div>
              <div className="inline-flex items-center gap-1 sm:gap-1.5 bg-surface-alt px-2 py-0.5 rounded-md border border-rule flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2da44e] animate-pulse" aria-hidden />
                <span className="text-nano font-bold text-[#2da44e] uppercase tracking-widest">
                  1.5×
                </span>
              </div>
            </div>

            <div className="relative bg-black">
              <video
                ref={videoRef}
                src={nearViewport ? "/demo.mp4" : undefined}
                poster="/chart-after.png"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onCanPlay={(e) => {
                  const el = e.currentTarget;
                  el.playbackRate = 1.5;
                  if (el.paused) el.play().catch(() => undefined);
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
                  onClick={togglePlay}
                  aria-label="Play demo"
                  className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                >
                  <span className="flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-white/95 text-ink shadow-card">
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

          <p className="mt-4 text-micro text-muted-faint text-center px-2">
            Muted · Looping · Playback 1.5× · Illustrative, not a trade recommendation
          </p>
        </div>
      </div>
    </section>
  );
}
