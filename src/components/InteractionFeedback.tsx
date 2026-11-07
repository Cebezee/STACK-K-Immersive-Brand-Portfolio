import { useEffect } from "react";

type Interaction = {
  scale?: Animation;
  translate?: Animation;
  over: boolean;
  pressed: boolean;
};

const selector =
  'button:not(:disabled), a[href]:not(.skip-link), [role="button"]:not([aria-disabled="true"])';
const cardSelector = ".project-visual-button, .experience-photo, .team-photo-button, .experiment";

/**
 * A shared interaction layer keeps native buttons, links, and portal dialogs
 * consistent without replacing their semantics or interfering with transforms.
 */
export default function InteractionFeedback() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const interactions = new Map<HTMLElement, Interaction>();
    const ripples = new Set<HTMLElement>();
    let hovered: HTMLElement | null = null;
    let pressed: HTMLElement | null = null;

    const control = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return null;
      const element = target.closest<HTMLElement>(selector);
      return element &&
        !element.matches('[aria-disabled="true"]') &&
        !element.closest('[inert], [data-motion="off"]')
        ? element
        : null;
    };
    const stateFor = (element: HTMLElement) => {
      let state = interactions.get(element);
      if (!state) {
        state = { over: false, pressed: false };
        interactions.set(element, state);
      }
      return state;
    };
    const prune = () => {
      interactions.forEach((state, element) => {
        if (!element.isConnected) {
          state.scale?.cancel();
          state.translate?.cancel();
          interactions.delete(element);
        }
      });
    };
    const isCard = (element: HTMLElement) =>
      element.matches(cardSelector) || element.querySelector(".play-preview") !== null;
    const hoverScale = (element: HTMLElement) =>
      isCard(element)
        ? 1.008
        : element.matches(".round-button, .hero-circle-button")
          ? 1.08
          : 1.025;
    const pressScale = (element: HTMLElement) => (isCard(element) ? 0.988 : 0.955);
    const setScale = (element: HTMLElement, target: number, spring = false) => {
      if (reduced.matches || !element.isConnected || typeof element.animate !== "function") return;
      const state = stateFor(element);
      const from = getComputedStyle(element).scale;
      state.scale?.cancel();
      const keyframes = spring
        ? [
            { scale: from === "none" ? "1" : from },
            { scale: String(target + 0.012), offset: 0.65 },
            { scale: String(target) },
          ]
        : [{ scale: from === "none" ? "1" : from }, { scale: String(target) }];
      const animation = element.animate(keyframes, {
        duration: spring ? 340 : state.pressed ? 110 : 220,
        easing: "cubic-bezier(.2,.8,.2,1)",
        fill: "forwards",
      });
      state.scale = animation;
      if (target === 1)
        animation.finished.then(
          () => {
            if (state.scale === animation && !state.over && !state.pressed) animation.cancel();
          },
          () => {},
        );
    };
    const resetTranslate = (element: HTMLElement) => {
      const state = stateFor(element);
      const from = getComputedStyle(element).translate;
      state.translate?.cancel();
      if (from === "none" || reduced.matches || !element.isConnected) return;
      const animation = element.animate([{ translate: from }, { translate: "0px 0px" }], {
        duration: 260,
        easing: "cubic-bezier(.16,1,.3,1)",
        fill: "forwards",
      });
      state.translate = animation;
      animation.finished.then(
        () => {
          if (state.translate === animation) animation.cancel();
        },
        () => {},
      );
    };
    const ripple = (element: HTMLElement, x: number, y: number) => {
      if (reduced.matches || element.matches('a[href^="#"]')) return;
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const computed = getComputedStyle(element);
      const clip = document.createElement("span");
      clip.setAttribute("aria-hidden", "true");
      clip.dataset.clickRipple = "true";
      Object.assign(clip.style, {
        position: "fixed",
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        borderRadius: computed.borderRadius,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: element.closest('[role="dialog"]') ? "95" : "50",
      });
      const wave = document.createElement("span");
      const diameter = Math.hypot(rect.width, rect.height) * 2;
      Object.assign(wave.style, {
        position: "absolute",
        left: `${x - rect.left}px`,
        top: `${y - rect.top}px`,
        width: `${diameter}px`,
        height: `${diameter}px`,
        borderRadius: "50%",
        background: computed.color,
        transformOrigin: "center",
        pointerEvents: "none",
      });
      clip.append(wave);
      document.body.append(clip);
      ripples.add(clip);
      const animation = wave.animate(
        [
          { transform: "translate(-50%, -50%) scale(0)", opacity: 0.16 },
          { transform: "translate(-50%, -50%) scale(0.6)", opacity: 0.09, offset: 0.5 },
          { transform: "translate(-50%, -50%) scale(1)", opacity: 0 },
        ],
        { duration: 480, easing: "cubic-bezier(.2,.7,.2,1)" },
      );
      const remove = () => {
        clip.remove();
        ripples.delete(clip);
      };
      animation.finished.then(remove, remove);
    };
    const onOver = (event: PointerEvent) => {
      if (reduced.matches || !finePointer.matches || event.pointerType !== "mouse") return;
      prune();
      const element = control(event.target);
      if (
        !element ||
        (event.relatedTarget instanceof Node && element.contains(event.relatedTarget))
      )
        return;
      hovered = element;
      const state = stateFor(element);
      state.over = true;
      element.dataset.interaction = "hover";
      if (!state.pressed) setScale(element, hoverScale(element), true);
    };
    const onOut = (event: PointerEvent) => {
      const element = control(event.target);
      if (
        !element ||
        (event.relatedTarget instanceof Node && element.contains(event.relatedTarget))
      )
        return;
      const state = stateFor(element);
      state.over = false;
      if (hovered === element) hovered = null;
      delete element.dataset.interaction;
      if (!state.pressed) setScale(element, 1);
      resetTranslate(element);
    };
    const onMove = (event: PointerEvent) => {
      if (!hovered || reduced.matches || !finePointer.matches || event.pointerType !== "mouse")
        return;
      const element = hovered;
      if (!element.isConnected) {
        hovered = null;
        prune();
        return;
      }
      const state = stateFor(element);
      if (
        state.pressed ||
        !element.matches(".button, .hero-work-link, .hero-note-action, .round-button") ||
        element.hasAttribute("aria-pressed")
      )
        return;
      const rect = element.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 4;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 4;
      const from = getComputedStyle(element).translate;
      state.translate?.cancel();
      state.translate = element.animate(
        [{ translate: from === "none" ? "0px 0px" : from }, { translate: `${x}px ${y}px` }],
        { duration: 180, easing: "ease-out", fill: "forwards" },
      );
    };
    const begin = (element: HTMLElement, x: number, y: number) => {
      if (reduced.matches) return;
      prune();
      if (pressed && pressed !== element) release();
      pressed = element;
      const state = stateFor(element);
      state.pressed = true;
      element.dataset.interaction = "press";
      setScale(element, pressScale(element));
      ripple(element, x, y);
    };
    const release = () => {
      if (!pressed) return;
      const element = pressed;
      pressed = null;
      const state = stateFor(element);
      state.pressed = false;
      element.dataset.interaction = state.over ? "hover" : "idle";
      setScale(element, state.over ? hoverScale(element) : 1, true);
    };
    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const element = control(event.target);
      if (element) begin(element, event.clientX, event.clientY);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
      const element = control(event.target);
      if (!element || (event.key === " " && element instanceof HTMLAnchorElement)) return;
      const rect = element.getBoundingClientRect();
      begin(element, rect.left + rect.width / 2, rect.top + rect.height / 2);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") release();
    };
    const clear = () => {
      interactions.forEach((state, element) => {
        state.scale?.cancel();
        state.translate?.cancel();
        delete element.dataset.interaction;
      });
      interactions.clear();
      ripples.forEach((element) => element.remove());
      ripples.clear();
      hovered = null;
      pressed = null;
    };
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerup", release);
    document.addEventListener("pointercancel", clear);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clear);
    reduced.addEventListener("change", clear);
    return () => {
      clear();
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", release);
      document.removeEventListener("pointercancel", clear);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clear);
      reduced.removeEventListener("change", clear);
    };
  }, []);
  return null;
}
