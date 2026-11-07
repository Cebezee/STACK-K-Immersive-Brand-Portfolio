import { useState } from "react";
import { motion } from "motion/react";
import { Copy, Type } from "lucide-react";
import { brandCaption, brandCaptionText } from "../data";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import styles from "./BrandCaption.module.css";

export default function BrandCaption({
  onCopy,
  compact = false,
}: {
  onCopy: (value: string, label: string) => void;
  compact?: boolean;
}) {
  const [original, setOriginal] = useState(false);
  const reduced = usePrefersReducedMotion();
  const [question, ...paragraphs] = brandCaptionText.split("\n");
  const body = paragraphs.join("\n");

  return (
    <div className={`${styles.caption} ${compact ? styles.compact : ""}`}>
      <div className={styles.toolbar}>
        <span>
          <Type size={13} /> THE BRAND CAPTION
        </span>
        <div role="group" aria-label="Caption display style">
          <button aria-pressed={!original} onClick={() => setOriginal(false)}>
            Readable
          </button>
          <button aria-pressed={original} onClick={() => setOriginal(true)}>
            Original styling
          </button>
        </div>
      </div>
      <motion.div
        key={original ? "original" : "readable"}
        initial={reduced ? false : { opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={styles.copy}
      >
        {original ? (
          <blockquote className={styles.original}>{brandCaption}</blockquote>
        ) : (
          <blockquote className={styles.readable}>
            <p>{question}</p>
            {"\n"}
            <p>
              <strong>STACK-K</strong>
              {body.slice("STACK-K".length)}
            </p>
          </blockquote>
        )}
      </motion.div>
      <div className={styles.bottom}>
        <button
          className="text-link"
          aria-label={compact ? "Copy the original caption" : "Copy exact caption"}
          onClick={() => onCopy(brandCaption, "Original caption")}
        >
          Copy caption <Copy size={14} />
        </button>
        <span>Copies your original styling.</span>
      </div>
    </div>
  );
}
