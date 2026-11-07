import { useState } from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import {
  ArrowUpRight,
  Play,
  Type,
  Palette,
  MousePointer2,
  Glasses,
  LayoutTemplate,
  Check,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { brandAssets, palette } from "../data";
import LogoFilm from "./LogoFilm";
import PerspectiveStudy from "./PerspectiveStudy";
import { contourPaths } from "./ContourRibbon";

export const experiments = [
  { id: "logo", title: "From sketch to identity", category: "LOGO / MOTION", icon: Play },
  { id: "type", title: "A type of possibility", category: "TYPOGRAPHY / MOTION", icon: Type },
  { id: "color", title: "Find your wavelength", category: "COLOR / INTERACTION", icon: Palette },
  {
    id: "product",
    title: "Your next learning path",
    category: "PRODUCT / PROTOTYPE",
    icon: MousePointer2,
  },
  {
    id: "perspective",
    title: "A shift in perspective",
    category: "IMMERSION / EXPLORATION",
    icon: Glasses,
  },
  {
    id: "interface",
    title: "A lighter interaction",
    category: "INTERFACE / TRANSITION",
    icon: LayoutTemplate,
  },
] as const;
export type ExperimentId = (typeof experiments)[number]["id"];

export function ExperimentPreview({ id }: { id: ExperimentId }) {
  if (id === "logo")
    return (
      <div className="play-preview play-logo">
        <img src={brandAssets.primary} alt="" />
        <span className="play-preview-button">
          <Play size={15} />
        </span>
      </div>
    );
  if (id === "type")
    return (
      <div className="play-preview play-type">
        <span>Aa</span>
        <small>
          KNOWLEDGE
          <br />
          IN MOTION.
        </small>
      </div>
    );
  if (id === "color")
    return (
      <div className="play-preview play-colors">
        {palette
          .filter((_, i) => [0, 1, 2, 5, 6].includes(i))
          .map((c) => (
            <i style={{ background: c.hex }} key={c.hex} />
          ))}
      </div>
    );
  if (id === "product")
    return (
      <div className="play-preview play-product">
        <div>
          <span>YOUR NEXT CHAPTER</span>
          <strong>
            What sparks
            <br />
            your curiosity?
          </strong>
          <i>
            Find my path <ArrowRight size={12} />
          </i>
        </div>
      </div>
    );
  if (id === "perspective")
    return (
      <div className="play-preview play-perspective">
        <svg
          className="contour-preview"
          viewBox="0 0 1200 220"
          preserveAspectRatio="none"
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
        >
          {contourPaths
            .filter((_, index) => index % 2 === 0)
            .map((d, index) => (
              <path key={index} d={d} />
            ))}
        </svg>
        <span>KNOWLEDGE IN MOTION.</span>
      </div>
    );
  return (
    <div className="play-preview play-interface">
      <div>
        <span />
        <i />
        <i />
        <div>
          <i />
          <i />
        </div>
      </div>
    </div>
  );
}

export default function PlayLab({ onOpen }: { onOpen: (id: ExperimentId) => void }) {
  const reduced = usePrefersReducedMotion();
  return (
    <section id="play" className="play-section section-space">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span>06 / PLAY</span> A LITTLE ROOM FOR CURIOSITY
            </p>
            <h2>
              EXPERIMENTS AND
              <br />
              EXPLORATIONS.
            </h2>
          </div>
          <p>
            Ideas in motion. Details worth exploring.
            <br />
            Small experiments from our creative process.
          </p>
        </div>
        <div className="experiments-grid">
          {experiments.map((e, i) => (
            <motion.button
              key={e.id}
              className="experiment"
              onClick={() => onOpen(e.id)}
              aria-label={`Try ${e.title}`}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.07 }}
            >
              <ExperimentPreview id={e.id} />
              <div className="experiment-meta">
                <div>
                  <span>
                    0{i + 1} / {e.category}
                  </span>
                  <h3>{e.title}</h3>
                </div>
                <ArrowUpRight size={20} strokeWidth={1.4} />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ExperimentPanel({
  id,
  onCopy,
  startWithMotion = false,
}: {
  id: ExperimentId;
  onCopy: (value: string, label: string) => void;
  startWithMotion?: boolean;
}) {
  const experiment = experiments.find((e) => e.id === id)!;
  return (
    <div className="experiment-panel">
      <p className="eyebrow">{experiment.category} / INTERACTIVE STUDY</p>
      <h2>{experiment.title}</h2>
      {id === "logo" ? (
        <LogoFilm />
      ) : id === "type" ? (
        <TypeExperiment />
      ) : id === "color" ? (
        <ColorExperiment onCopy={onCopy} />
      ) : id === "product" ? (
        <ProductExperiment />
      ) : id === "perspective" ? (
        <PerspectiveStudy startWithMotion={startWithMotion} />
      ) : (
        <InterfaceExperiment />
      )}
      <p className="experiment-disclaimer">
        A creative prototype by STACK-K. Explore freely — nothing is saved or submitted.
      </p>
    </div>
  );
}

function TypeExperiment() {
  const [iteration, setIteration] = useState(0);
  const [family, setFamily] = useState("Audiowide");
  const reduced = usePrefersReducedMotion();
  return (
    <div className="type-experiment">
      <div className="experiment-options" role="group" aria-label="Choose typeface">
        {["Audiowide", "Archivo"].map((f) => (
          <button
            key={f}
            aria-pressed={family === f}
            className={f === family ? "active" : ""}
            onClick={() => setFamily(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="type-stage" style={{ fontFamily: family }} key={`${family}-${iteration}`}>
        {["STACK", "KNOWLEDGE.", "SAVE TIME."].map((word, i) => (
          <motion.span
            key={word}
            initial={reduced ? false : { opacity: 0, y: 20, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
          >
            {word}
          </motion.span>
        ))}
      </div>
      <button className="text-link" onClick={() => setIteration((v) => v + 1)}>
        Animate the phrase <RotateCcw size={15} />
      </button>
    </div>
  );
}

function ColorExperiment({ onCopy }: { onCopy: (value: string, label: string) => void }) {
  const [selected, setSelected] = useState(2);
  const color = palette[selected];
  return (
    <div className="color-experiment">
      <div
        className="color-stage"
        style={{ background: color.hex, color: color.light ? "#151141" : "#FFFFFF" }}
      >
        <span>THE STACK-K SPECTRUM</span>
        <h3>
          Same idea.
          <br />
          New energy.
        </h3>
        <div>
          <span>{color.name}</span>
          <span>{color.hex}</span>
        </div>
      </div>
      <div className="color-controls" role="group" aria-label="Explore official brand colors">
        {palette.map((c, i) => (
          <button
            key={c.hex}
            aria-label={`Preview ${c.name}`}
            aria-pressed={selected === i}
            style={{ background: c.hex, color: c.light ? "#151141" : "white" }}
            onClick={() => setSelected(i)}
          >
            {selected === i && <Check size={17} />}
          </button>
        ))}
      </div>
      <button className="text-link" onClick={() => onCopy(color.hex, color.name)}>
        Copy {color.hex} <ArrowUpRight size={15} />
      </button>
    </div>
  );
}

function ProductExperiment() {
  const [skill, setSkill] = useState("Creative thinking");
  const [showPath, setShowPath] = useState(false);
  const [completed, setCompleted] = useState(0);
  const paths: Record<string, string[]> = {
    "Creative thinking": [
      "See a familiar idea differently",
      "Explore three possible directions",
      "Create your own first concept",
    ],
    "Digital skills": [
      "Discover the tools and vocabulary",
      "Try a guided interface exercise",
      "Build a small interactive prototype",
    ],
    "Career discovery": [
      "Explore a profession that interests you",
      "Try a realistic career scenario",
      "Reflect on your next direction",
    ],
  };
  return (
    <div className="product-experiment">
      <span className="prototype-badge">SKILL PODS / INTERFACE CONCEPT</span>
      {!showPath ? (
        <>
          <h3>
            What sparks
            <br />
            your curiosity?
          </h3>
          <p>Choose a direction to preview a sample learning path.</p>
          <div className="skill-options">
            {Object.keys(paths).map((s) => (
              <button
                key={s}
                className={skill === s ? "active" : ""}
                aria-pressed={skill === s}
                onClick={() => setSkill(s)}
              >
                {s}
                {skill === s && <Check size={14} />}
              </button>
            ))}
          </div>
          <button className="button button-navy" onClick={() => setShowPath(true)}>
            Preview my path <ArrowRight size={16} />
          </button>
        </>
      ) : (
        <>
          <h3>
            Your next chapter.
            <br />
            <span>{skill}.</span>
          </h3>
          <p>A sample path, not an AI-generated or saved plan.</p>
          <div className="sample-path">
            {paths[skill].map((step, i) => (
              <button key={step} onClick={() => setCompleted(i + 1)} aria-pressed={completed > i}>
                <span>{completed > i ? <Check size={15} /> : `0${i + 1}`}</span>
                {step}
              </button>
            ))}
          </div>
          <p className="prototype-progress" aria-live="polite">
            {completed === 3
              ? "A small step. A new possibility. Sample path complete."
              : `${completed} of 3 sample steps explored.`}
          </p>
          <button
            className="text-link"
            onClick={() => {
              setShowPath(false);
              setCompleted(0);
            }}
          >
            Choose another direction <RotateCcw size={14} />
          </button>
        </>
      )}
    </div>
  );
}

function InterfaceExperiment() {
  const [dark, setDark] = useState(false);
  return (
    <div className="interface-experiment">
      <div className={`interface-stage ${dark ? "dark" : ""}`}>
        <div className="interface-stage-top">
          <span>LEARNING CHAMBERS</span>
          <button
            role="switch"
            aria-checked={dark}
            aria-label="Dark study environment"
            className="demo-switch"
            onClick={() => setDark(!dark)}
          >
            <motion.i layout transition={{ type: "spring", stiffness: 450, damping: 30 }} />
          </button>
        </div>
        <h3>
          Space to
          <br />
          think clearly.
        </h3>
        <p>A quieter interface. A little more focus.</p>
        <div className="demo-progress">
          <span />
          <span />
          <span />
        </div>
        <span className="interface-mode" aria-live="polite">
          {dark ? "NIGHT MODE / A CALMER VIEW" : "DAY MODE / A FRESH PERSPECTIVE"}
        </span>
      </div>
      <p>Toggle the study environment to try an intentional interface transition.</p>
    </div>
  );
}
