import { useLayoutEffect } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "../lib/gsap";

/**
 * Subtle scroll-linked drift for cover-filled photography.
 *
 * The progress of each target through the viewport is written to a CSS custom
 * property, which the stylesheet scales into a percentage of the image's own
 * height. Keeping the two separate means the drift composes with — and can
 * never overwrite — the hover `transform` rules CSS already owns on these
 * images, it stays off the layout path entirely, and the travel stays
 * proportional to the frame at every breakpoint instead of being a fixed
 * number of pixels that could out-run the crop at a smaller size.
 *
 * `selector` is queried against the document, so it should stay specific enough
 * to only match the images you intend (e.g. `.experience-photo > img`).
 */
export function useImageParallax(selector: string, deps: readonly unknown[] = []) {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const targets = gsap.utils.toArray<HTMLElement>(selector);
    if (targets.length === 0) return;

    const triggers = targets.map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          // Centre of the range sits at zero so the image rests where CSS put
          // it. 2.5 stays inside the 3% of height the stylesheet's scale buys.
          el.style.setProperty("--parallax-p", ((0.5 - self.progress) * 5).toFixed(3));
        },
      }),
    );

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      targets.forEach((el) => el.style.removeProperty("--parallax-p"));
    };
    // The caller decides when the set of matching targets changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
