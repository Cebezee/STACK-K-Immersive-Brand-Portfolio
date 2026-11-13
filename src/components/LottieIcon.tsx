import { useEffect, useRef, useState, type ReactNode } from "react";
import type { AnimationItem, LottiePlayer } from "lottie-web";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type LottieIconProps = {
  /** Public URL of the Lottie JSON, e.g. "/lottie/scroll-cue.json". */
  src: string;
  /** The lucide-react (or any) icon shown when Lottie cannot or should not run. */
  fallback: ReactNode;
  /** Rendered box size in px — matches the lucide `size` it replaces. */
  size?: number;
  /** Extra class for the outer box, so existing layout rules keep applying. */
  className?: string;
  /** Set when the icon is the only content and has no adjacent text label. */
  title?: string;
};

/**
 * Plays a small looping Lottie where the design calls for one, and degrades to
 * the original lucide icon whenever Lottie must not run: reduced motion, a
 * failed download, or the animation leaving the viewport (the loop pauses
 * there rather than burning frames nobody can see).
 *
 * The player is imported on demand rather than bundled up front — two 15px
 * icons are not worth putting the whole renderer in the critical path. Until
 * it arrives (or if it never does) the lucide fallback stays on screen in the
 * same fixed-size box, so the swap is invisible and layout never shifts.
 */
export function LottieIcon({ src, fallback, size = 16, className, title }: LottieIconProps) {
  const host = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const useLottie = !reduced && !failed;

  useEffect(() => {
    if (!useLottie || !host.current) return;

    let cancelled = false;
    let animation: AnimationItem | null = null;
    let observer: IntersectionObserver | null = null;
    const container = host.current;

    const onFail = () => {
      if (!cancelled) setFailed(true);
    };

    (async () => {
      let player: LottiePlayer;
      try {
        // Static JSON with no expressions, text or audio: the light player has
        // the SVG renderer and every shape modifier these two animations use.
        ({ default: player } = await import("lottie-web/build/player/lottie_light"));
      } catch {
        onFail();
        return;
      }
      if (cancelled) return;

      try {
        animation = player.loadAnimation({
          container,
          renderer: "svg",
          loop: true,
          autoplay: false,
          path: src,
          rendererSettings: {
            // Let CSS decide the box; the player only fills it.
            preserveAspectRatio: "xMidYMid meet",
            className: "lottie-icon__svg",
          },
        });
      } catch {
        onFail();
        return;
      }

      const onReady = () => {
        if (!cancelled) setReady(true);
      };
      animation.addEventListener("DOMLoaded", onReady);
      animation.addEventListener("data_failed", onFail);
      animation.addEventListener("error", onFail);

      // Only run the loop while the icon can actually be seen.
      if ("IntersectionObserver" in window) {
        observer = new IntersectionObserver(
          ([entry]) => {
            if (!animation) return;
            if (entry.isIntersecting) animation.play();
            else animation.pause();
          },
          { threshold: 0 },
        );
        observer.observe(container);
      } else {
        animation.play();
      }
    })();

    return () => {
      cancelled = true;
      observer?.disconnect();
      animation?.destroy();
    };
  }, [src, useLottie]);

  const box = { width: size, height: size } as const;
  const baseClass = `lottie-icon${className ? ` ${className}` : ""}`;

  // Reduced motion, or the player never made it: the fallback is permanent.
  if (!useLottie) {
    return (
      <span className={baseClass} style={box} title={title}>
        {fallback}
      </span>
    );
  }

  return (
    <span className={baseClass} style={box} title={title}>
      <span
        ref={host}
        className="lottie-icon__host"
        // Hidden until the player has painted, so no blank frame shows through.
        style={{ visibility: ready ? "visible" : "hidden" }}
        aria-hidden="true"
      />
      {!ready && (
        <span className="lottie-icon__fallback" aria-hidden="true">
          {fallback}
        </span>
      )}
    </span>
  );
}
