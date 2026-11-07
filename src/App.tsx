import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Menu,
  X,
  Check,
} from "lucide-react";
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
import {
  BrandPreview,
  FooterSignature,
} from "./components/PortfolioEnhancements";

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
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 26, filter: "blur(3px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
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
  return (
    <div className="prototype-rail" aria-label="STACK-K learning prototype">
      <div className="prototype-rail-intro">
        <span className="eyebrow"><span>PROTOTYPE / 01</span> THE IMMERSIVE LOOP</span>
        <p>From curiosity to capability.</p>
      </div>
      <div className="prototype-steps">
        {prototypeSteps.map((step, index) => (
          <motion.div
            key={step.index}
            className="prototype-step"
            initial={reduced ? false : { opacity: 0, x: index % 2 ? 18 : -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.55, delay: index * 0.1 }}
          >
            <span>{step.index}</span>
            <strong>{step.label}</strong>
            <p>{step.detail}</p>
            {index < prototypeSteps.length - 1 && <i aria-hidden="true" />}
          </motion.div>
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
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const stageY = useTransform(scrollYProgress, [0, 0.72, 1], [0, reduced ? 0 : -34, -72]);
  const stageScale = useTransform(scrollYProgress, [0, 0.72, 1], [1, 0.98, 0.94]);
  const stageOpacity = useTransform(scrollYProgress, [0, 0.82, 1], [1, 1, 0.72]);
  const whiteReveal = useTransform(scrollYProgress, [0.55, 1], ["100%", "0%"]);
  const lines = Array.from({ length: 24 });
  return (
    <section ref={sectionRef} className="brief-sequence" aria-labelledby="brief-heading">
      <motion.div
        className="brief-sequence-stage"
        style={{ y: stageY, scale: stageScale, opacity: stageOpacity }}
      >
        <div className="brief-sequence-rays" aria-hidden="true">
          {lines.map((_, index) => (
            <i
              key={index}
              style={{ "--ray-angle": `${index * 15}deg`, "--ray-delay": `${index * 0.05}s` } as React.CSSProperties}
            />
          ))}
        </div>
        <div className="brief-sequence-orbit" aria-hidden="true" />
        <div className="brief-sequence-core" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, index) => (
            <i key={index} style={{ "--core-angle": `${index * 18}deg` } as React.CSSProperties} />
          ))}
          <span />
        </div>
        <div className="brief-sequence-copy">
        <p className="eyebrow"><span>01 / PORTFOLIO CONTENT</span> A CURATED STACK-K STUDY</p>
        <motion.h2
          id="brief-heading"
          initial={reduced ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          THE STORY
          <br />
          <em>BEHIND</em> STACK-K.
        </motion.h2>
        <p className="brief-sequence-tagline">STACK KNOWLEDGE. SAVE TIME.</p>
        <p className="brief-sequence-lead">A focused presentation of our concept, identity, and campaigns.</p>
          <div className="brief-sequence-chapters" aria-label="Required portfolio content">
          {briefSections.map((item, index) => (
            <motion.article
              key={item.number}
              className="brief-sequence-chapter"
              initial={reduced ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
            >
              <div className="brief-sequence-chapter-head">
                <span>{item.number}</span>
                <span>STACK-K / CHAPTER</span>
              </div>
              <h3>{item.title}</h3>
              <strong>{item.subtitle}</strong>
              <p>{item.detail}</p>
              <a href={item.href}>Explore {item.title.toLowerCase()} <ArrowUpRight size={14} /></a>
            </motion.article>
          ))}
          </div>
        </div>
      </motion.div>
      <motion.div className="brief-sequence-white-reveal" style={{ y: whiteReveal }} aria-hidden="true" />
      <span className="brief-sequence-coordinate">STACK-K / 01—04</span>
      <span className="brief-sequence-scroll">EXPLORE THE STORY <ArrowDown size={15} /></span>
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
      if (point.current) point.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
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
      <span ref={ring} className={`custom-cursor-ring${active ? " is-active" : ""}`} aria-hidden="true">
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
    requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" }),
    );
  };
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
    "STACK-K";
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
      <header className="site-header">
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
              <div>
                {company.history.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
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
                  <img src={person.image} alt={person.name} loading="lazy" />
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
  onOpen,
}: {
  experience: Experience;
  index: number;
  onOpen: () => void;
}) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.article
      className={`experience-preview experience-${experience.id}`}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-25px" }}
      transition={{ duration: 0.65, delay: (index % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        className="experience-photo"
        onClick={onOpen}
        aria-label={`Explore ${experience.title}`}
      >
        <img src={`/images/${experience.id}.webp`} alt={photoAlt[experience.id]} loading="lazy" />
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
    </motion.article>
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
