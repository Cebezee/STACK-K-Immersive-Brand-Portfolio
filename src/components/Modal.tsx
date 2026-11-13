import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { getSmoothScroll } from "../lib/smoothScroll";
import { X } from "lucide-react";

export default function Modal({
  title,
  children,
  onClose,
  focusAfterClose,
  className = "",
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  focusAfterClose?: () => HTMLElement | null;
  className?: string;
}) {
  const dialog = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Lenis must not keep animating against a viewport that is locked shut.
    getSmoothScroll()?.stop();
    dialog.current?.focus();
    function keydown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !dialog.current) return;
      const controls = Array.from(
        dialog.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
        ),
      );
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === dialog.current)
      ) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = overflow;
      getSmoothScroll()?.start();
      document.removeEventListener("keydown", keydown);
      (focusAfterClose?.() || previous)?.focus({ preventScroll: true });
    };
  }, [onClose, focusAfterClose]);

  return createPortal(
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        ref={dialog}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`modal ${className}`}
        initial={{ opacity: 0, y: reduced ? 0 : 32, scale: reduced ? 1 : 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reduced ? 0 : 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close icon-button" onClick={onClose} aria-label="Close dialog">
          <X size={21} />
        </button>
        {children}
      </motion.div>
    </motion.div>,
    document.body,
  );
}
