import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { ArrowRight, MoveUpRight } from "lucide-react";
import { featuredVisual } from "../data";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import MotionField from "./MotionField";
import styles from "./PerspectiveStudy.module.css";

export default function PerspectiveStudy({
  startWithMotion = false,
}: {
  startWithMotion?: boolean;
}) {
  const [mode, setMode] = useState<"image" | "motion">(startWithMotion ? "motion" : "image");
  const [alternate, setAlternate] = useState(false);
  const reduced = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const tiltX = useSpring(x, { stiffness: 140, damping: 25 });
  const tiltY = useSpring(y, { stiffness: 140, damping: 25 });
  useEffect(() => {
    if (reduced) {
      x.set(0);
      y.set(0);
    }
  }, [reduced, x, y]);
  return (
    <div className={styles.study}>
      <div className={styles.modes} role="group" aria-label="Perspective visual mode">
        <button aria-pressed={mode === "image"} onClick={() => setMode("image")}>
          Image study
        </button>
        <button aria-pressed={mode === "motion"} onClick={() => setMode("motion")}>
          Motion field <MoveUpRight size={13} />
        </button>
      </div>
      {mode === "image" ? (
        <>
          <div
            className={styles.stage}
            onPointerMove={(event) => {
              if (reduced || event.pointerType !== "mouse") return;
              const rect = event.currentTarget.getBoundingClientRect();
              x.set(-((event.clientY - rect.top) / rect.height - 0.5) * 6);
              y.set(((event.clientX - rect.left) / rect.width - 0.5) * 6);
            }}
            onPointerLeave={() => {
              x.set(0);
              y.set(0);
            }}
          >
            <motion.div
              className={styles.frame}
              style={{ rotateX: reduced ? 0 : tiltX, rotateY: reduced ? 0 : tiltY }}
            >
              <img
                src={alternate ? "/images/career-simulator.webp" : featuredVisual.src}
                alt={alternate ? "A virtual-reality training demonstration" : featuredVisual.alt}
              />
              <div>
                <span>EXPERIENCE, NOT JUST INFORMATION.</span>
                <span>{alternate ? "02" : "01"} / 02</span>
              </div>
            </motion.div>
          </div>
          <div className={styles.photoActions}>
            <p>
              A brighter perspective on what comes next.
              <br />
              Move gently across the image, or explore the live motion field.
            </p>
            <button className="text-link" onClick={() => setAlternate((value) => !value)}>
              Change perspective <ArrowRight size={15} />
            </button>
          </div>
          <button className={styles.motionLink} onClick={() => setMode("motion")}>
            See knowledge in motion <MoveUpRight size={16} />
          </button>
        </>
      ) : (
        <MotionField />
      )}
    </div>
  );
}
