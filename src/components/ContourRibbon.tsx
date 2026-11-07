import { useId, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import styles from "./ContourRibbon.module.css";

export const contourPaths = Array.from({ length: 25 }, (_, i) => {
  const y = 78 + i * 4.7;
  const crest = 14 + i * 1.5;
  return `M-60 ${y} C190 ${y + 8} 300 ${y + 15} 390 ${y - 16} C475 ${y - 48} 480 ${crest} 600 ${crest} C720 ${crest} 730 ${y - 50} 820 ${y - 18} C925 ${y + 12} 1050 ${y + 5} 1260 ${y}`;
});

export default function ContourRibbon() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const id = useId().replace(/:/g, "");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [14, -14]);
  const scaleY = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [0.85, 1.12]);
  return (
    <div className={styles.ribbon} ref={ref} aria-hidden="true">
      <motion.svg viewBox="0 0 1200 220" preserveAspectRatio="none" style={{ y, scaleY }}>
        <defs>
          <linearGradient id={`${id}fade`}>
            <stop offset="0%" stopColor="#3157A8" stopOpacity="0.08" />
            <stop offset="45%" stopColor="#504E9D" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#9E89FA" stopOpacity="0.16" />
          </linearGradient>
        </defs>
        <g fill="none" stroke={`url(#${id}fade)`} strokeWidth="0.8">
          {contourPaths.map((d, index) => (
            <motion.path
              key={index}
              d={d}
              vectorEffect="non-scaling-stroke"
              initial={reduced ? false : { pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: index * 0.013, ease: "easeOut" }}
            />
          ))}
        </g>
      </motion.svg>
    </div>
  );
}
