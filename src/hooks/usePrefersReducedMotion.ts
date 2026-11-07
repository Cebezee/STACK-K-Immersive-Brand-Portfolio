import { useSyncExternalStore } from "react";

let preference: MediaQueryList | undefined;

function mediaQuery() {
  return (preference ??= window.matchMedia("(prefers-reduced-motion: reduce)"));
}

function subscribe(onChange: () => void) {
  const query = mediaQuery();
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// Keep motion preferences live; the installed Motion hook is a mount-time snapshot.
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => mediaQuery().matches,
    () => true,
  );
}
