import { useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { gsap } from "../lib/gsap";
import { ArrowRight, ArrowUpRight, Compass, Home, Layers3, Play } from "lucide-react";
import { brandAssets, featuredVisual, palette, projects, type ProjectId } from "../data";
import { ExperimentPreview, experiments, type ExperimentId } from "./PlayLab";
import { Logo, ProjectVisual } from "./CaseStudies";
import LogoFilm from "./LogoFilm";
import BrandCaption from "./BrandCaption";
import ContourRibbon from "./ContourRibbon";
import { LottieIcon } from "./LottieIcon";
import styles from "./PortfolioEnhancements.module.css";

export function HeroVisual({ onOpen, onMotion }: { onOpen: () => void; onMotion: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : -20, reduced ? 0 : 20]);
  return (
    <div ref={ref} className="hero-feature-image">
      <motion.img
        style={{ y }}
        src={featuredVisual.src}
        alt={featuredVisual.alt}
        fetchPriority="high"
      />
      <button className={styles.motionEntry} onClick={onMotion}>
        <Play size={12} />
        Try the live motion field
      </button>
      <button aria-label="Explore STACK-K Product Experiences" onClick={onOpen}>
        <ArrowUpRight size={30} strokeWidth={1.2} />
      </button>
      <span className={styles.visualIndex}>01 / A DIFFERENT PERSPECTIVE</span>
    </div>
  );
}

export function WorkPlayRail({ onOpen }: { onOpen: (id: ExperimentId) => void }) {
  return (
    <aside className={styles.rail} aria-label="Interactive studio experiments">
      <div className={styles.railHeading}>
        <span>
          <i /> A LITTLE ROOM TO PLAY
        </span>
        <p>
          Not just a portfolio.
          <br />
          Something to explore.
        </p>
      </div>
      <div className={styles.railGrid}>
        {experiments.map((experiment) => (
          <button
            key={experiment.id}
            onClick={() => onOpen(experiment.id)}
            aria-label={`Quick play: ${experiment.title}`}
          >
            <ExperimentPreview id={experiment.id} />
            <span>
              {experiment.category.split(" / ")[0]}
              <ArrowUpRight size={13} />
            </span>
          </button>
        ))}
      </div>
      <a className={styles.railLink} href="#play">
        Explore the playground <ArrowRight size={14} />
      </a>
      <span className={styles.railNote}>SMALL IDEAS. REAL INTERACTIONS.</span>
    </aside>
  );
}

export function JourneyDock({ activeSection, hidden }: { activeSection: string; hidden: boolean }) {
  const { scrollYProgress, scrollY } = useScroll();
  const [engaged, setEngaged] = useState(false);
  useMotionValueEvent(scrollY, "change", (value) => setEngaged(value > 180));
  const reduced = usePrefersReducedMotion();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30 });
  if (hidden || !engaged) return null;
  return (
    <motion.nav
      className={styles.dock}
      aria-label="Portfolio quick navigation"
      initial={{ opacity: 0, y: reduced ? 0 : 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <a
        className={styles.dockHome}
        href="#home"
        aria-label="Back to introduction"
        title="Back to introduction"
      >
        <Home size={15} strokeWidth={1.6} />
      </a>
      <span className={styles.dockDivider} />
      {[
        { id: "work", label: "Work", icon: Layers3 },
        { id: "world", label: "Explore", icon: Compass },
        { id: "play", label: "Play", icon: Play },
      ].map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-label={item.label}
          title={item.label}
          aria-current={activeSection === item.id ? "location" : undefined}
        >
          {item.icon && <item.icon size={13} strokeWidth={1.5} />}
          <span className={styles.dockLabel}>{item.label}</span>
        </a>
      ))}
      <motion.span
        className={styles.dockProgress}
        style={{ scaleX: reduced ? scrollYProgress : progress }}
        aria-hidden="true"
      />
    </motion.nav>
  );
}

export function BrandPreview({
  id,
  onOpen,
  onCopy,
}: {
  id: "identity" | "logo" | "post" | "event";
  onOpen: (id: ProjectId) => void;
  onCopy: (value: string, label: string) => void;
}) {
  const project = projects.find((item) => item.id === id)!;
  return (
    <div className={styles.brandPreview}>
      <div className={styles.brandPreviewGrid}>
        <div className={styles.brandVisual}>
          <ProjectVisual id={id} />
        </div>
        <div className={styles.brandText}>
          <p className={styles.overline}>
            THE STACK-K ARCHIVE / 0{["identity", "logo", "post", "event"].indexOf(id) + 1}
          </p>
          <h3>
            {id === "identity" ? (
              <>
                One idea.
                <br />
                Every expression.
              </>
            ) : id === "logo" ? (
              <>
                From the first spark.
                <br />
                To a distinct identity.
              </>
            ) : id === "post" ? (
              <>
                Our brand
                <br />
                poster.
              </>
            ) : (
              <>
                STAY UP.
                <br />
                Keep learning.
              </>
            )}
          </h3>
          <p>{project.description}</p>
          {id === "identity" ? (
            <div className={styles.officialLogos}>
              <figure>
                <Logo />
                <figcaption>PRIMARY / SUPPLIED VECTOR</figcaption>
              </figure>
              <figure>
                <Logo secondary />
                <figcaption>SECONDARY / SUPPLIED SIGNATURE</figcaption>
              </figure>
            </div>
          ) : id === "logo" ? (
            <p className={styles.brandDetail}>
              The actual pencil sketch. The original digital forms. A 15-second motion prototype you
              can play and explore below.
            </p>
          ) : id === "post" ? (
            <BrandCaption compact onCopy={onCopy} />
          ) : (
            <p className={styles.brandDetail}>
              A light bulb, a numbered path, and a little curiosity. Learn → Skills → Create →
              Ideas.
            </p>
          )}
          <button className="button button-navy" onClick={() => onOpen(id)}>
            Explore the full case study <ArrowUpRight size={16} />
          </button>
          {id === "identity" && (
            <a
              className={styles.originalPresentation}
              href={brandAssets.secondaryPresentation}
              target="_blank"
              rel="noreferrer"
            >
              View supplied secondary-logo presentation <ArrowUpRight size={12} />
            </a>
          )}
        </div>
      </div>
      {id === "logo" && (
        <div className={styles.inlineFilm}>
          <div>
            <p className={styles.overline}>FROM SKETCH TO IDENTITY.</p>
            <h4>
              A little process.
              <br />A bigger perspective.
            </h4>
            <p>
              Press play, select a chapter, or scrub the timeline. This is a prototype, not recorded
              development footage.
            </p>
          </div>
          <LogoFilm />
        </div>
      )}
      <div className={styles.brandEssentials}>
        <div>
          <span>THE OFFICIAL BLUE–VIOLET SPECTRUM</span>
          <div className={styles.miniPalette}>
            {palette.map((color) => (
              <button
                key={color.hex}
                onClick={() => onCopy(color.hex, color.name)}
                aria-label={`Copy ${color.name} ${color.hex}`}
              >
                <i style={{ background: color.hex }} />
                <span>{color.hex}</span>
              </button>
            ))}
          </div>
        </div>
        <div className={styles.typePair}>
          <span>TWO TYPEFACES. ONE VOICE.</span>
          <p>
            <span>Audiowide</span>
            <strong>Archivo</strong>
          </p>
          <small>DISPLAY & BRAND / BODY & SUPPORTING</small>
        </div>
      </div>
    </div>
  );
}

export function FooterSignature() {
  const reduced = usePrefersReducedMotion();
  const logoRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = logoRef.current;
    if (!el || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(el, {
        opacity: 0,
        y: 18,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 92%",
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div className={styles.footerSignature}>
      <div>
        <span>THERE’S A WHOLE NEW WORLD TO KNOW.</span>
        <a href="#world">
          Stay curious{" "}
          <LottieIcon
            src="/lottie/cta-arrow.json"
            size={15}
            fallback={<ArrowUpRight size={15} />}
          />
        </a>
      </div>
      <div className={styles.signatureArtwork}>
        <ContourRibbon />
        <div ref={logoRef} className={styles.signatureLogo}>
          <Logo secondary />
        </div>
      </div>
      <p>STACK KNOWLEDGE. SAVE TIME.</p>
    </div>
  );
}
