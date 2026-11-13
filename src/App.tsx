import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from "motion/react";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useImageParallax } from "./hooks/useImageParallax";
import { bindAnchorScrolling, scrollToTarget, startSmoothScroll } from "./lib/smoothScroll";
import { gsap, REVEAL, ScrollTrigger } from "./lib/gsap";
import { ArrowUpRight, ArrowDown, ArrowRight, ArrowUp, Menu, X, Check } from "lucide-react";
import {
  company,
  featuredVisual,
  contact,
  experiences,
  projects,
  team,
  photoCredits,
  type Experience,
  type ProjectId,
} from "./data";
import Modal from "./components/Modal";
import { LottieIcon } from "./components/LottieIcon";
import {
  IdentityCaseStudy,
  LogoCaseStudy,
  PosterCaseStudy,
  ProductCaseStudy,
  ProjectVisual,
  Logo,
} from "./components/CaseStudies";
import InteractionFeedback from "./components/InteractionFeedback";
import OrbitSelector from "./components/OrbitSelector";
import { BrandPreview, FooterSignature } from "./components/PortfolioEnhancements";

const navigation = [
  { id: "home", label: "Home" },
  { id: "about", label: "Concept" },
  { id: "experiences", label: "Products" },
  { id: "brand", label: "Brand Materials" },
  { id: "team", label: "Owners" },
];
const brandTabs = [
  { id: "identity", label: "Brand identity" },
  { id: "logo", label: "Logo design" },
  { id: "post", label: "Brand poster" },
  { id: "event", label: "Promotional event poster" },
] as const;
type Overlay =
  | { type: "project"; id: ProjectId }
  | { type: "product"; id: string }
  | { type: "team"; index: number }
  | { type: "credits" };

function Reveal({
  children,
  className = "",
  delay = 0,
  stagger = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** When set, the direct children reveal one after another instead of the wrapper. */
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  // One context per instance so StrictMode's double effect and any preference
  // flip both leave the markup exactly as it was authored.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const ctx = gsap.context(() => {
      const targets = stagger > 0 ? Array.from(el.children) : [el];
      if (targets.length === 0) return;

      gsap.from(targets, {
        opacity: 0,
        y: REVEAL.distance,
        duration: REVEAL.duration,
        delay,
        stagger,
        ease: REVEAL.ease,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [reduced, delay, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  return <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />;
}

const prototypeSteps = [
  { index: "01", label: "ENTER", detail: "Choose a world to explore." },
  { index: "02", label: "EXPERIENCE", detail: "Learn through direct interaction." },
  { index: "03", label: "APPLY", detail: "Carry knowledge into action." },
];

function PrototypeRail() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(".prototype-step", {
        opacity: 0,
        x: (i: number) => (i % 2 ? 18 : -18),
        duration: 0.55,
        stagger: 0.1,
        ease: REVEAL.ease,
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={ref} className="prototype-rail" aria-label="STACK-K learning prototype">
      <div className="prototype-rail-intro">
        <span className="eyebrow">
          <span>PROTOTYPE / 01</span> THE IMMERSIVE LOOP
        </span>
        <p>From curiosity to capability.</p>
      </div>
      <div className="prototype-steps">
        {prototypeSteps.map((step, index) => (
          <div key={step.index} className="prototype-step">
            <span>{step.index}</span>
            <strong>{step.label}</strong>
            <p>{step.detail}</p>
            {index < prototypeSteps.length - 1 && <i aria-hidden="true" />}
          </div>
        ))}
      </div>
    </div>
  );
}

const briefSections = [
  {
    number: "01",
    title: "BUSINESS CONCEPT",
    subtitle: "DEVELOPMENT",
    detail: "Mission · Vision · Owners · History · Products / Services",
    href: "#about",
  },
  {
    number: "02",
    title: "LOGO",
    subtitle: "DESIGN",
    detail: "Logo process · Color schemes / palette · Typography",
    href: "#brand",
  },
  {
    number: "03",
    title: "BRAND",
    subtitle: "POSTER",
    detail: "Color schemes / palette · Typography · Caption",
    href: "#brand",
  },
  {
    number: "04",
    title: "PROMOTIONAL",
    subtitle: "EVENT POSTER",
    detail: "Color schemes / palette · Typography",
    href: "#brand",
  },
] as const;

function BriefSequence() {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const whiteRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const lines = Array.from({ length: 24 });

  // Entrance timeline and scroll scrub live in one context so a single revert
  // puts the hero back to its static markup.
  useLayoutEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".brief-eyebrow", { opacity: 0, y: 18, duration: 0.6 })
        .from(".brief-line", { opacity: 0, y: 46, duration: 0.95, stagger: 0.12 }, "-=0.35")
        .from(".brief-sequence-tagline", { opacity: 0, y: 16, duration: 0.6 }, "-=0.55")
        .from(".brief-sequence-lead", { opacity: 0, y: 16, duration: 0.6 }, "-=0.5")
        .from(
          ".brief-sequence-chapter",
          { opacity: 0, y: 26, duration: 0.6, stagger: 0.09 },
          "-=0.35",
        )
        .from(
          [".brief-sequence-coordinate", ".brief-sequence-scroll"],
          { opacity: 0, duration: 0.6, stagger: 0.1 },
          "-=0.4",
        );

      // Scroll-driven exit: the stage drifts back while the white panel rises,
      // mirroring the original motion timeline keyframe for keyframe.
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
        .to(stageRef.current, { y: -34, scale: 0.98, duration: 0.72 }, 0)
        .to(stageRef.current, { y: -72, scale: 0.94, duration: 0.28 }, 0.72)
        .to(stageRef.current, { opacity: 0.72, duration: 0.18 }, 0.82)
        .fromTo(whiteRef.current, { y: "100%" }, { y: "0%", duration: 0.45 }, 0.55);
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  // A small amount of pointer depth sells the VR framing. Desktop pointers only.
  useEffect(() => {
    if (reduced) return;
    const target = parallaxRef.current;
    if (!target || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const moveX = gsap.quickTo(target, "x", { duration: 1, ease: "power3.out" });
    const moveY = gsap.quickTo(target, "y", { duration: 1, ease: "power3.out" });
    const onMove = (event: PointerEvent) => {
      moveX((event.clientX / window.innerWidth - 0.5) * 26);
      moveY((event.clientY / window.innerHeight - 0.5) * 18);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.killTweensOf(target);
      gsap.set(target, { x: 0, y: 0 });
    };
  }, [reduced]);

  return (
    <section ref={sectionRef} className="brief-sequence" aria-labelledby="brief-heading">
      <div className="brief-sequence-glow" aria-hidden="true" />
      <div ref={stageRef} className="brief-sequence-stage">
        <div className="brief-sequence-rays" aria-hidden="true">
          {lines.map((_, index) => (
            <i
              key={index}
              style={
                {
                  "--ray-angle": `${index * 15}deg`,
                  "--ray-delay": `${index * 0.05}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
        <div ref={parallaxRef} className="brief-sequence-parallax" aria-hidden="true">
          <div className="brief-sequence-orbit" />
          <div className="brief-sequence-core">
            {Array.from({ length: 10 }).map((_, index) => (
              <i
                key={index}
                style={{ "--core-angle": `${index * 18}deg` } as React.CSSProperties}
              />
            ))}
            <span />
          </div>
        </div>
        <div className="brief-sequence-copy">
          <p className="eyebrow brief-eyebrow">
            <span>01 / PORTFOLIO CONTENT</span> A CURATED STACK-K STUDY
          </p>
          <h2 id="brief-heading">
            <span className="brief-line">THE STORY</span>
            <span className="brief-line">
              <em>BEHIND</em> STACK-K.
            </span>
          </h2>
          <p className="brief-sequence-tagline">STACK KNOWLEDGE. SAVE TIME.</p>
          <p className="brief-sequence-lead">
            A focused presentation of our concept, identity, and campaigns.
          </p>
          <div className="brief-sequence-chapters" aria-label="Required portfolio content">
            {briefSections.map((item) => (
              <article key={item.number} className="brief-sequence-chapter">
                <div className="brief-sequence-chapter-head">
                  <span>{item.number}</span>
                  <span>STACK-K / CHAPTER</span>
                </div>
                <h3>{item.title}</h3>
                <strong>{item.subtitle}</strong>
                <p>{item.detail}</p>
                <a href={item.href}>
                  Explore {item.title.toLowerCase()} <ArrowUpRight size={14} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
      <div ref={whiteRef} className="brief-sequence-white-reveal" aria-hidden="true" />
      <span className="brief-sequence-coordinate">STACK-K / 01—04</span>
      <span className="brief-sequence-scroll">
        EXPLORE THE STORY{" "}
        <LottieIcon
          className="brief-cue-icon"
          src="/lottie/scroll-cue.json"
          size={15}
          fallback={<ArrowDown size={15} />}
        />
      </span>
    </section>
  );
}

function CustomCursor() {
  const reduced = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState("");
  const point = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    if (!finePointer.matches || reduced) return;
    setEnabled(true);
    document.body.classList.add("has-custom-cursor");
    const move = (event: PointerEvent) => {
      target.current = { x: event.clientX, y: event.clientY };
      const interactive = (event.target as HTMLElement).closest("a, button, [data-cursor]");
      setActive(Boolean(interactive));
      setLabel(interactive?.getAttribute("data-cursor") || "");
    };
    let frameId = 0;
    const frame = () => {
      current.current.x += (target.current.x - current.current.x) * 0.18;
      current.current.y += (target.current.y - current.current.y) * 0.18;
      if (point.current)
        point.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0)`;
      if (ring.current)
        ring.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      frameId = requestAnimationFrame(frame);
    };
    window.addEventListener("pointermove", move, { passive: true });
    frameId = requestAnimationFrame(frame);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frameId);
      document.body.classList.remove("has-custom-cursor");
    };
  }, [reduced]);

  if (!enabled) return null;
  return (
    <>
      <span ref={point} className="custom-cursor-point" aria-hidden="true" />
      <span
        ref={ring}
        className={`custom-cursor-ring${active ? " is-active" : ""}`}
        aria-hidden="true"
      >
        {label}
      </span>
    </>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const [filter, setFilter] = useState("All experiences");
  const [toast, setToast] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const pendingFocus = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuOpenRef = useRef(false);
  const reduced = usePrefersReducedMotion();
  const closeOverlay = useCallback(() => setOverlay(null), []);
  const focusAfterClose = useCallback(() => {
    const destination = pendingFocus.current;
    pendingFocus.current = null;
    return destination;
  }, []);
  const notify = useCallback((message: string) => {
    setToast(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 3200);
  }, []);
  const copy = useCallback(
    async (value: string, label: string) => {
      try {
        await navigator.clipboard.writeText(value);
        notify(`${label} copied to clipboard`);
      } catch {
        notify("Clipboard unavailable. Please select and copy the displayed text.");
      }
    },
    [notify],
  );
  const jumpTo = (id: string) => {
    const destination = document.getElementById(id);
    if (destination) {
      destination.tabIndex = -1;
      pendingFocus.current = destination;
    }
    setOverlay(null);
    setMenuOpen(false);
    // Wait a frame so an open dialog can unmount and release its scroll lock
    // before Lenis starts moving the page.
    requestAnimationFrame(() => scrollToTarget(id));
  };

  // Cover-fit photography only: the drift is a few pixels either side of rest,
  // so it reads as depth rather than as the image sliding out of its frame.
  useImageParallax(".experience-photo > img[data-parallax]", [reduced, filter]);
  useImageParallax(".team-photo-button > img[data-parallax]", [reduced]);

  useEffect(() => {
    const stop = startSmoothScroll();
    const unbind = bindAnchorScrolling();
    return () => {
      unbind();
      stop();
    };
  }, [reduced]);

  // The About orbit ring has no photo to parallax, so it drifts instead:
  // scroll progress writes --ring-y, which the ring reads via `translate`.
  useLayoutEffect(() => {
    const section = document.getElementById("about");
    if (!section || reduced) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          section.style.setProperty("--ring-y", `${(0.5 - self.progress) * 90}px`);
        },
      });
    }, section);

    return () => {
      ctx.revert();
      section.style.removeProperty("--ring-y");
    };
  }, [reduced]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }),
      { rootMargin: "-10% 0px -65% 0px" },
    );
    [...navigation].forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => {
      observer.disconnect();
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const handle = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [menuOpen]);

  // Keep a mirror of the menu state so the scroll handler below never has to
  // re-subscribe (and never captures a stale value) just because it opened.
  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);

  // Navbar behaviour: a shadow once the page has left the top, hide on a
  // committed downward run, reveal on the way back up — and always reveal when
  // scrolling settles so the bar can never be left stranded off-screen after an
  // anchor jump. Everything is a class toggle, so the header only ever moves on
  // the compositor.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    let lastY = window.scrollY;
    let direction = 0;
    let travelled = 0;
    let frame = 0;
    let settle: ReturnType<typeof setTimeout> | undefined;

    const reveal = () => header.classList.remove("is-hidden");

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;

      header.classList.toggle("is-scrolled", y > 8);

      // Keep a reveal armed on every update, so a zero-delta scroll event can
      // never clear the timer and leave the bar stranded off-screen.
      if (settle) clearTimeout(settle);
      settle = setTimeout(reveal, 700);

      const canHide = !reduced && !menuOpenRef.current && y > 180;
      if (!canHide) {
        reveal();
        direction = 0;
        travelled = 0;
        return;
      }
      if (delta === 0) return;

      const next = delta > 0 ? 1 : -1;
      if (next !== direction) {
        direction = next;
        travelled = 0;
      }
      travelled += Math.abs(delta);

      // Lenis hands out a couple of pixels per frame, so wait for a committed
      // run rather than reacting to the first nudge.
      if (direction === 1 && travelled > 120) header.classList.add("is-hidden");
      if (direction === -1 && travelled > 24) reveal();
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      if (settle) clearTimeout(settle);
      header.classList.remove("is-hidden", "is-scrolled");
    };
  }, [reduced]);

  const filtered = experiences.filter((e) => filter === "All experiences" || e.category === filter);
  const selectedProduct =
    overlay?.type === "product" ? experiences.find((e) => e.id === overlay.id) : null;
  const selectedProject =
    overlay?.type === "project" ? projects.find((p) => p.id === overlay.id) : null;
  const selectedPerson = overlay?.type === "team" ? team[overlay.index] : null;
  const overlayTitle =
    selectedProject?.title ||
    selectedProduct?.title ||
    selectedPerson?.name ||
    "Photography credits";
  const caseStudy = (id: ProjectId) =>
    id === "identity" ? (
      <IdentityCaseStudy onCopy={copy} />
    ) : id === "logo" ? (
      <LogoCaseStudy />
    ) : id === "post" || id === "event" ? (
      <PosterCaseStudy event={id === "event"} onCopy={copy} />
    ) : (
      <ProductCaseStudy onExplore={jumpTo} />
    );

  return (
    <MotionConfig reducedMotion={reduced ? "always" : "never"}>
      <ScrollProgress />
      <CustomCursor />
      <InteractionFeedback />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header ref={headerRef} className="site-header">
        <div className="container header-inner">
          <a href="#home" className="header-logo" aria-label="STACK-K home">
            <Logo secondary />
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={activeSection === item.id ? "location" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <button
            ref={menuButton}
            className="menu-toggle round-button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              className="mobile-navigation"
              id="mobile-navigation"
              aria-label="Mobile navigation"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {navigation.map((item, i) => (
                <a key={item.id} href={`#${item.id}`} onClick={() => setMenuOpen(false)}>
                  <span>0{i + 1}</span>
                  {item.label}
                  <ArrowUpRight size={21} />
                </a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="main">
        <div id="home">
          <BriefSequence />
        </div>

        <section id="about" className="about-section section-space">
          <div className="container">
            <Reveal className="about-intro">
              <p className="eyebrow">
                <span>01 / BUSINESS CONCEPT</span> STACK KNOWLEDGE
              </p>
              <div>
                <h2>
                  THE IDEA
                  <br />
                  BEHIND STACK-K.
                </h2>
                <p>
                  What if the distance between
                  <br />
                  <span>“I know”</span> and <span>“I can”</span>
                  <br />
                  was an experience?
                </p>
              </div>
            </Reveal>
            <div className="history-layout">
              <span className="eyebrow">OUR STORY</span>
              <Reveal stagger={0.12}>
                {company.history.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </Reveal>
            </div>
            <Reveal className="purpose-editorial">
              <div>
                <span>01 / OUR MISSION</span>
                <h3>
                  Learn faster.
                  <br />
                  Contribute sooner.
                </h3>
              </div>
              <p>{company.mission}</p>
              <ArrowUpRight size={25} strokeWidth={1} />
            </Reveal>
            <Reveal className="purpose-editorial">
              <div>
                <span>02 / OUR VISION</span>
                <h3>
                  Knowledge without
                  <br />
                  the limits of time.
                </h3>
              </div>
              <p>{company.vision}</p>
              <ArrowUpRight size={25} strokeWidth={1} />
            </Reveal>
          </div>
        </section>

        <section id="experiences" className="experiences-section container section-space">
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow">
                <span>02 / PRODUCTS & SERVICES</span>
              </p>
              <h2>
                EXPERIENCE
                <br />
                KNOWLEDGE.
              </h2>
            </div>
            <p>
              Not just something to know.
              <br />
              Something to be part of.
            </p>
          </Reveal>
          <OrbitSelector selected={filter} onSelect={setFilter} />
          <div className="experience-filterbar">
            <div role="group" aria-label="Filter experiences">
              {["All experiences", "Personal growth", "Discovery", "Community"].map((f) => (
                <button
                  key={f}
                  aria-pressed={filter === f}
                  className={filter === f ? "active" : ""}
                  onClick={() => setFilter(f)}
                >
                  {f}
                  {f === "All experiences" && <span>07</span>}
                </button>
              ))}
            </div>
            <span aria-live="polite">
              {String(filtered.length).padStart(2, "0")} CONCEPTS TO EXPLORE
            </span>
          </div>
          <PrototypeRail />
          <div className="experience-grid">
            {filtered.map((experience, i) => (
              <ExperiencePreview
                key={experience.id}
                experience={experience}
                index={i}
                revision={filter}
                onOpen={() => setOverlay({ type: "product", id: experience.id })}
              />
            ))}
          </div>
          <p className="experience-note">
            <span className="status-dot" />
            Product and service concepts. Photography is illustrative, not a depiction of launched
            products.
          </p>
        </section>

        <section id="brand" className="brand-section section-space">
          <div className="container">
            <Reveal className="section-heading">
              <div>
                <p className="eyebrow">
                  <span>03 / BRAND MATERIALS</span>
                </p>
                <h2>
                  AN IDENTITY.
                  <br />
                  EVERY EXPRESSION.
                </h2>
              </div>
              <p>
                The materials. The details. The process.
                <br />
                Explore STACK-K from the inside out.
              </p>
            </Reveal>
            <div className="brand-materials-list">
              {brandTabs.map((tab, index) => (
                <Reveal key={tab.id} className="brand-material-item" delay={index * 0.08}>
                  <div className="brand-material-heading">
                    <span>0{index + 1}</span>
                    <h3>{tab.label}</h3>
                    <ArrowUpRight size={17} />
                  </div>
                  <BrandPreview
                    id={tab.id}
                    onOpen={(id) => setOverlay({ type: "project", id })}
                    onCopy={copy}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="team" className="team-section container section-space">
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow">
                <span>04 / THE OWNERS</span>
              </p>
              <h2>
                THE PEOPLE
                <br />
                BEHIND STACK-K.
              </h2>
            </div>
            <p>
              Four perspectives.
              <br />
              One shared curiosity.
            </p>
          </Reveal>
          <div className="team-grid">
            {team.map((person, i) => (
              <Reveal key={person.surname} className="team-profile" delay={i * 0.05}>
                <button
                  onClick={() => setOverlay({ type: "team", index: i })}
                  className="team-photo-button"
                  aria-label={`View profile: ${person.name}`}
                >
                  <img src={person.image} alt={person.name} loading="lazy" data-parallax />
                  <span className="team-index">0{i + 1}</span>
                  <span className="profile-arrow">
                    <ArrowUpRight size={22} strokeWidth={1.3} />
                  </span>
                </button>
                <div className="team-profile-copy">
                  <h3>{person.name}</h3>
                  <span>{person.role || "STACK-K TEAM"}</span>
                  <p>{person.biography || "Profile details to be added."}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="team-note">
            Roles and biographies will be shared by the team. No unprovided personal details have
            been added.
          </p>
        </section>
      </main>

      <footer className="site-footer container">
        <div className="footer-main">
          <a href="#home" aria-label="STACK-K home">
            <Logo secondary />
          </a>
          <p>
            STACK KNOWLEDGE.
            <br />
            SAVE TIME.
          </p>
          <nav aria-label="Footer navigation">
            {navigation.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item.label}
              </a>
            ))}
          </nav>
          <a href="#home" className="footer-backtop">
            Back to top <ArrowUp size={17} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} STACK-K. A collective perspective.</span>
          <div>
            {contact.socialLinks.map((link) => (
              <a href={link.url} key={link.url} target="_blank" rel="noreferrer">
                {link.label}
                <ArrowUpRight size={12} />
              </a>
            ))}
            <button onClick={() => setOverlay({ type: "credits" })}>
              Photography credits <ArrowUpRight size={12} />
            </button>
          </div>
          <span>DESIGNED TO BE EXPERIENCED.</span>
        </div>
        <FooterSignature />
      </footer>

      <AnimatePresence>
        {overlay && (
          <Modal
            title={overlayTitle}
            onClose={closeOverlay}
            focusAfterClose={focusAfterClose}
            className={
              overlay.type === "project"
                ? "case-modal"
                : overlay.type === "product"
                  ? "product-modal"
                  : overlay.type === "team"
                    ? "profile-modal"
                    : "credits-modal"
            }
          >
            {overlay.type === "project" && (
              <>
                <div className="case-modal-bar">
                  <span>STACK-K / SELECTED WORK</span>
                  <span>
                    PROJECT {selectedProject?.number} / {String(projects.length).padStart(2, "0")}
                  </span>
                </div>
                {caseStudy(overlay.id)}
                <div className="next-project">
                  <span>KEEP EXPLORING</span>
                  <button
                    onClick={() => {
                      const index = projects.findIndex((p) => p.id === overlay.id);
                      setOverlay({
                        type: "project",
                        id: projects[(index + 1) % projects.length].id,
                      });
                      document
                        .querySelector(".case-modal")
                        ?.scrollTo({ top: 0, behavior: "instant" });
                    }}
                  >
                    Next project <ArrowRight size={18} />
                  </button>
                </div>
              </>
            )}
            {overlay.type === "product" && selectedProduct && (
              <ProductDetail
                product={selectedProduct}
                onNext={() => {
                  const next =
                    (experiences.findIndex((e) => e.id === selectedProduct.id) + 1) %
                    experiences.length;
                  setOverlay({ type: "product", id: experiences[next].id });
                }}
              />
            )}
            {overlay.type === "team" && selectedPerson && (
              <>
                <img
                  className="profile-modal-image"
                  src={selectedPerson.image}
                  alt={selectedPerson.name}
                />
                <div className="profile-modal-copy">
                  <p className="eyebrow">THE STACK-K COLLECTIVE</p>
                  <h2>{selectedPerson.name}</h2>
                  <dl>
                    <div>
                      <dt>ROLE</dt>
                      <dd>{selectedPerson.role || "Not yet provided."}</dd>
                    </div>
                    <div>
                      <dt>BIOGRAPHY</dt>
                      <dd>
                        {selectedPerson.biography ||
                          "This team member’s biography will be added when shared."}
                      </dd>
                    </div>
                  </dl>
                </div>
              </>
            )}
            {overlay.type === "credits" && (
              <div className="credits-content">
                <p className="eyebrow">IMAGERY / ACKNOWLEDGEMENTS</p>
                <h2>
                  A shared
                  <br />
                  perspective.
                </h2>
                <p>
                  Product photography is illustrative and sourced from Unsplash. Brand artwork and
                  team portraits were supplied by STACK-K.
                </p>
                <ul>
                  <li>
                    <span>Homepage & VR showcase</span>
                    <a href={featuredVisual.creditUrl} target="_blank" rel="noreferrer">
                      {featuredVisual.photographer} <ArrowUpRight size={13} />
                    </a>
                  </li>
                  {photoCredits.map((credit) => (
                    <li key={credit.product}>
                      <span>{credit.product}</span>
                      <a href={credit.url} target="_blank" rel="noreferrer">
                        {credit.author}
                        <ArrowUpRight size={13} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Modal>
        )}
      </AnimatePresence>
      <div className="toast-region" role="status" aria-live="polite">
        <AnimatePresence>
          {toast && (
            <motion.div
              className="toast"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Check size={16} />
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

function ExperiencePreview({
  experience,
  index,
  revision,
  onOpen,
}: {
  experience: Experience;
  index: number;
  /** Mirrors the active filter so the grid re-enters whenever it changes. */
  revision: string;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  // The card rises as a whole, then its copy resolves line by line. The context
  // is reverted on every filter switch so nothing is left hidden behind a
  // trigger that already fired.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const ctx = gsap.context(() => {
      const copy = el.querySelector(".experience-copy");
      const parts = copy ? Array.from(copy.children) : [];

      const timeline = gsap.timeline({
        defaults: { ease: REVEAL.ease },
        delay: (index % 3) * 0.07,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });

      // clearProps hands the transform back to CSS so the hover lift below is
      // never fighting an inline style left behind by the entrance.
      timeline.from(el, {
        opacity: 0,
        y: 24,
        duration: REVEAL.duration,
        clearProps: "transform,opacity",
      });

      if (parts.length) {
        timeline.from(
          parts,
          {
            opacity: 0,
            y: 16,
            duration: 0.6,
            stagger: 0.07,
            clearProps: "transform,opacity",
          },
          "-=0.4",
        );
      }
    }, el);

    return () => ctx.revert();
  }, [reduced, index, revision]);

  return (
    <article ref={ref} className={`experience-preview experience-${experience.id}`}>
      <button
        className="experience-photo"
        onClick={onOpen}
        aria-label={`Explore ${experience.title}`}
      >
        <img
          src={`/images/${experience.id}.webp`}
          alt={photoAlt[experience.id]}
          loading="lazy"
          data-parallax
        />
        <span>0{index + 1}</span>
        <i>
          <ArrowUpRight size={23} strokeWidth={1.3} />
        </i>
      </button>
      <div className="experience-copy">
        <span className="eyebrow">{experience.tag}</span>
        <h3>{experience.title}</h3>
        <p>{experience.description}</p>
        <button className="text-link" onClick={onOpen}>
          Explore <ArrowUpRight size={15} />
        </button>
      </div>
    </article>
  );
}
const photoAlt: Record<string, string> = {
  "skill-pods": "A student concentrating on a personalized digital learning session",
  "learning-chambers": "A quiet modern library designed for focused study",
  "dream-state": "A calm bedside environment with warm light for rest",
  "career-simulator": "A person exploring a professional virtual reality demonstration",
  "bloodline-history": "Hands exploring family memories in a physical photograph album",
  "history-time-travel": "The Colosseum in Rome, connecting learners with historical places",
  "skill-swap": "People exchanging ideas and skills at a creative workshop",
};
function ProductDetail({ product, onNext }: { product: Experience; onNext: () => void }) {
  return (
    <>
      <img
        className="product-modal-photo"
        src={`/images/${product.id}.webp`}
        alt={photoAlt[product.id]}
      />
      <div className="product-modal-copy">
        <p className="eyebrow">{product.tag}</p>
        <h2>{product.title}</h2>
        <p>{product.detail}</p>
        <div className="product-detail-steps">
          <span className="eyebrow">IMAGINE THE EXPERIENCE</span>
          {product.steps.map((step, i) => (
            <div key={step}>
              <span>0{i + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
        <div className="product-modal-bottom">
          <span>PRODUCT & SERVICE CONCEPT</span>
          <button className="text-link" onClick={onNext}>
            Next experience <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </>
  );
}
