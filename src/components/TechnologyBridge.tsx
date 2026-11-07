import { motion } from "motion/react";
import { ArrowUpRight, BrainCircuit, Glasses, Users } from "lucide-react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import type { Experience } from "../data";
import styles from "./TechnologyBridge.module.css";

const technologies = [
  {
    title: "Artificial intelligence",
    tag: "PERSONALIZED POSSIBILITY",
    description: "A learning path shaped around your curiosity.",
    product: "skill-pods",
    label: "Explore AI-powered learning",
    icon: BrainCircuit,
  },
  {
    title: "Virtual reality",
    tag: "A DIFFERENT PERSPECTIVE",
    description: "Step into a new direction before you choose it.",
    product: "career-simulator",
    label: "Explore virtual-reality learning",
    icon: Glasses,
  },
  {
    title: "Human connection",
    tag: "KNOWLEDGE, SHARED",
    description: "Something to teach. Someone to learn from.",
    product: "skill-swap",
    label: "Explore community skill exchange",
    icon: Users,
  },
] as const;

export default function TechnologyBridge({
  onExplore,
}: {
  onExplore: (id: Experience["id"]) => void;
}) {
  const reduced = usePrefersReducedMotion();
  return (
    <section className={styles.bridge} aria-labelledby="technology-title">
      <motion.div
        className={styles.rule}
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      />
      <div className={styles.heading}>
        <div>
          <span>THREE PERSPECTIVES. ONE SHARED PURPOSE.</span>
          <h3 id="technology-title">
            Technology.
            <br />
            <span>With a human purpose.</span>
          </h3>
        </div>
        <p>
          Different ways to experience knowledge.
          <br />
          The same belief in your potential.
        </p>
      </div>
      <div className={styles.cards}>
        {technologies.map((item, index) => (
          <motion.button
            key={item.product}
            className={styles.card}
            aria-label={item.label}
            onClick={() => onExplore(item.product)}
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.6, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.top}>
              <span className={styles.icon}>
                <item.icon size={25} strokeWidth={1.35} />
                <i />
              </span>
              <span>0{index + 1}</span>
            </div>
            <span className={styles.tag}>{item.tag}</span>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
            <span className={styles.action}>
              Explore the concept <ArrowUpRight size={17} />
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
