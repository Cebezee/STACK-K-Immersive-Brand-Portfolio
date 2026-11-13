import Lenis from "lenis";
import { ScrollTrigger, gsap, prefersReducedMotion } from "./gsap";

let lenis: Lenis | null = null;
let tickerDriver: ((time: number) => void) | null = null;
let refreshHandler: (() => void) | null = null;

/** The live Lenis instance, or null while smooth scrolling is off. */
export function getSmoothScroll(): Lenis | null {
  return lenis;
}

/**
 * Start Lenis and drive it from the GSAP ticker so scrolling and animation
 * share one clock — the ScrollTrigger integration depends on that pairing.
 * Safe to call more than once; returns the teardown function.
 */
export function startSmoothScroll(): () => void {
  if (lenis) return stopSmoothScroll;
  // Under reduced motion we never take over scrolling at all: the browser
  // keeps full control and nothing runs a scroll loop.
  if (prefersReducedMotion()) return stopSmoothScroll;

  const instance = new Lenis({
    lerp: 0.09,
    smoothWheel: true,
    touchMultiplier: 1.6,
    autoResize: true,
    // Anchor links are handled by bindAnchorScrolling so focus, history and
    // the mobile menu all stay correct.
    anchors: false,
    respectReducedMotion: true,
  });
  lenis = instance;

  tickerDriver = (time: number) => instance.raf(time * 1000);
  gsap.ticker.add(tickerDriver);
  // Lenis wants a raw ticker; otherwise GSAP's lag smoothing fights it.
  gsap.ticker.lagSmoothing(0);

  instance.on("scroll", ScrollTrigger.update);

  // Fonts and late-loading images change section heights, so re-measure once
  // they settle and when the window resizes.
  refreshHandler = () => ScrollTrigger.refresh();
  window.addEventListener("load", refreshHandler);
  document.fonts?.ready.then(() => refreshHandler?.());

  return stopSmoothScroll;
}

export function stopSmoothScroll(): void {
  if (tickerDriver) gsap.ticker.remove(tickerDriver);
  tickerDriver = null;
  if (refreshHandler) {
    window.removeEventListener("load", refreshHandler);
    refreshHandler = null;
  }
  lenis?.destroy();
  lenis = null;
}

/**
 * Scroll to a section id through Lenis when it is running, otherwise fall back
 * to the browser. Lenis reads `scroll-padding-top` itself, so the sticky header
 * offset stays defined in one place (CSS) rather than being duplicated here.
 */
export function scrollToTarget(id: string): boolean {
  const target = document.getElementById(id);
  if (!target) return false;

  if (lenis && !prefersReducedMotion()) {
    lenis.scrollTo(target, { duration: 1.15 });
  } else {
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  }
  return true;
}

/**
 * Route every in-page anchor through scrollToTarget so the header, footer,
 * mobile menu, hero chapter cards and skip link all share one smooth,
 * focus-preserving scroll. Returns a teardown function.
 */
export function bindAnchorScrolling(): () => void {
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

    const hash = link.getAttribute("href") ?? "";
    if (!hash.startsWith("#") || hash.length < 2) return;

    const id = decodeURIComponent(hash.slice(1));
    const destination = document.getElementById(id);
    if (!destination) return;

    event.preventDefault();
    scrollToTarget(id);

    // Keep the address bar shareable without firing a second native jump.
    if (window.location.hash !== hash) history.pushState(null, "", hash);

    // Land keyboard and screen-reader users on the section now in view.
    destination.tabIndex = -1;
    destination.focus({ preventScroll: true });
  };

  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}
