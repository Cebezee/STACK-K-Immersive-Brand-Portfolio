import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { ArrowUpRight } from "lucide-react";
import styles from "./OrbitSelector.module.css";

const stages = [
  {
    number: "01",
    title: "Discover",
    category: "Discovery",
    description: "A different perspective.",
  },
  {
    number: "02",
    title: "Develop",
    category: "Personal growth",
    description: "Your next possibility.",
  },
  { number: "03", title: "Connect", category: "Community", description: "Knowledge, shared." },
];

export default function OrbitSelector({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (category: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-40, 200]);
  const reverseRotate = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [45, -160]);
  const travel = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-16, 16]);
  const line = useTransform(scrollYProgress, [0, 0.55], reduced ? [1, 1] : [0.1, 1]);
  return (
    <div className={styles.selector} ref={ref}>
      <div className={styles.heading}>
        <span>EVERY JOURNEY STARTS WITH CURIOSITY.</span>
        <span>
          CHOOSE YOUR STARTING POINT <ArrowUpRight size={12} />
        </span>
      </div>
      <div className={styles.track} role="group" aria-label="Choose an experience starting point">
        <motion.div className={styles.line} style={{ scaleX: line }} aria-hidden="true" />
        {stages.map((stage, index) => (
          <button
            className={styles.stage}
            key={stage.title}
            aria-pressed={selected === stage.category}
            aria-label={`${stage.title}: show ${stage.category.toLowerCase()} experiences`}
            onClick={() =>
              onSelect(selected === stage.category ? "All experiences" : stage.category)
            }
          >
            <span className={styles.diagram} aria-hidden="true">
              <motion.span
                className={`${styles.ring} ${styles.ringOne}`}
                style={{ rotate: index === 1 ? reverseRotate : rotate }}
              >
                <i />
              </motion.span>
              <motion.span
                className={`${styles.ring} ${styles.ringTwo}`}
                style={{ rotate: index === 1 ? rotate : reverseRotate }}
              >
                <i />
              </motion.span>
              <motion.span className={styles.core} style={{ x: travel }} />
              <span className={styles.orbitTick} />
            </span>
            <span className={styles.label}>
              <small>{stage.number}</small>
              <strong>{stage.title}</strong>
              <ArrowUpRight size={14} />
            </span>
            <span className={styles.description}>{stage.description}</span>
          </button>
        ))}
      </div>
      <p className={styles.hint}>
        Select an orbit to explore its concepts, or browse the complete collection below.
      </p>
    </div>
  );
}
