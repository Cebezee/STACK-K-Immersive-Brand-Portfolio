import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * One shared timing vocabulary for every scroll reveal on the page, so section
 * transitions read as a single system instead of a set of one-off tweens.
 */
export const REVEAL = {
  duration: 0.75,
  ease: "power3.out",
  stagger: 0.08,
  distance: 34,
} as const;

/** Live check against the system reduced-motion preference. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export { gsap, ScrollTrigger };
