import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { Pause, Play, RotateCcw, Glasses, BookOpen } from "lucide-react";
import { brandAssets, logoProcessVideo } from "../data";

const stages = [
  { start: 0, end: 3, label: "The original sketch", short: "SKETCH" },
  { start: 3, end: 6, label: "The idea, in three parts", short: "COMPONENTS" },
  { start: 6, end: 10, label: "Refining the digital form", short: "DEVELOPMENT" },
  { start: 10, end: 13, label: "The primary symbol", short: "PRIMARY" },
  { start: 13, end: 15, label: "The complete signature", short: "SECONDARY" },
];

export default function LogoFilm() {
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const frame = useRef(0);
  const clock = useRef(0);
  const currentTime = useRef(0);
  const reduced = usePrefersReducedMotion();
  const stageIndex = stages.findIndex((s) => time >= s.start && time < s.end);
  const stage = stageIndex < 0 ? 4 : stageIndex;
  const seek = (value: number) => {
    setTime(value);
    currentTime.current = value;
    clock.current = performance.now() - value * 1000;
  };

  useEffect(() => {
    if (!reduced) setPlaying(true);
  }, [reduced]);

  useEffect(() => {
    if (!playing) return;
    clock.current = performance.now() - currentTime.current * 1000;
    const tick = (now: number) => {
      const elapsed = (now - clock.current) / 1000;
      if (elapsed >= 15) {
        currentTime.current = 0;
        clock.current = now;
        setTime(0);
        frame.current = requestAnimationFrame(tick);
        return;
      }
      currentTime.current = elapsed;
      setTime(elapsed);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [playing]);

  if (logoProcessVideo)
    return (
      <div className="recorded-film">
        <video
          src={logoProcessVideo}
          controls
          playsInline
          preload="metadata"
          aria-label="Recorded STACK-K logo development video"
        />
      </div>
    );

  return (
    <div className="logo-film">
      <div className="film-screen">
        <div className="film-topline">
          <span>FROM SKETCH TO IDENTITY.</span>
          <span>STACK-K / MOTION STUDY 01</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            className={`film-scene scene-${stage}`}
            key={stage}
            initial={{ opacity: 0, y: reduced ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {stage === 0 && (
              <img
                className="film-sketch"
                src="/images/logo-sketch.webp"
                alt="The actual original STACK-K pencil sketch"
              />
            )}
            {stage === 1 && (
              <div className="film-components">
                <div>
                  <span className="component-letter">S</span>
                  <small>THE INITIAL</small>
                </div>
                <span>+</span>
                <div>
                  <Glasses size={56} strokeWidth={1.2} />
                  <small>VIRTUAL REALITY</small>
                </div>
                <span>+</span>
                <div>
                  <BookOpen size={56} strokeWidth={1.2} />
                  <small>AN OPEN BOOK</small>
                </div>
              </div>
            )}
            {stage === 2 && (
              <div className="digital-transition">
                <img
                  src="/images/logo-sketch.webp"
                  alt="Original sketch transitioning to the digital logo"
                  style={{ opacity: Math.max(0, 1 - (time - 6) / 3) }}
                />
                <img
                  src={brandAssets.primary}
                  alt="Refined original digital STACK-K symbol"
                  style={{ opacity: Math.min(1, (time - 6) / 3) }}
                />
              </div>
            )}
            {stage === 3 && (
              <img
                className="film-primary"
                src={brandAssets.primary}
                alt="Final primary STACK-K symbol"
              />
            )}
            {stage === 4 && (
              <img
                className="film-secondary"
                src={brandAssets.secondary}
                alt="Final secondary STACK-K logo with the supplied wordmark"
              />
            )}
          </motion.div>
        </AnimatePresence>
        <div className="film-bottomline">
          <span>
            0{stage + 1} / {stages[stage].label}
          </span>
          <span>ANIMATION PROTOTYPE · NOT RECORDED FOOTAGE</span>
        </div>
      </div>
      <div className="film-controls">
        <button
          className="round-button"
          onClick={() => {
            if (time >= 15) seek(0);
            setPlaying(!playing);
          }}
          aria-label={
            playing
              ? "Pause logo animation"
              : time >= 15
                ? "Replay logo animation"
                : "Play logo animation"
          }
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <input
          aria-label="Logo animation timeline"
          type="range"
          min="0"
          max="15"
          step="0.05"
          value={time}
          onChange={(e) => seek(Number(e.target.value))}
          style={{ "--progress": `${(time / 15) * 100}%` } as React.CSSProperties}
        />
        <span className="film-time">{time.toFixed(1).padStart(4, "0")} / 15s</span>
        <button
          className="round-button"
          onClick={() => {
            seek(0);
            setPlaying(false);
          }}
          aria-label="Reset logo animation"
        >
          <RotateCcw size={15} />
        </button>
      </div>
      <div className="film-chapters">
        {stages.map((s, i) => (
          <button
            key={s.short}
            className={stage === i ? "active" : ""}
            onClick={() => {
              seek(s.start);
              setPlaying(false);
            }}
          >
            <span>
              {s.start}–{s.end}s
            </span>
            {s.short}
          </button>
        ))}
      </div>
    </div>
  );
}
