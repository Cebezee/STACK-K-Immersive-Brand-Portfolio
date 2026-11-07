import { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownToLine,
  Copy,
  BookOpen,
  Glasses,
  Plus,
  ArrowRight,
} from "lucide-react";
import {
  brandAssets,
  featuredVisual,
  palette,
  experiences,
  projects,
  type ProjectId,
} from "../data";
import LogoFilm from "./LogoFilm";
import BrandCaption from "./BrandCaption";

export function Logo({
  secondary = false,
  className = "",
}: {
  secondary?: boolean;
  className?: string;
}) {
  return (
    <img
      className={`official-logo ${secondary ? "secondary-logo" : "primary-logo"} ${className}`}
      src={secondary ? brandAssets.secondary : brandAssets.primary}
      alt={
        secondary ? "STACK-K — symbol and official wordmark" : "STACK-K — original primary symbol"
      }
    />
  );
}

export function ProjectVisual({ id }: { id: ProjectId }) {
  if (id === "identity")
    return (
      <div className="project-art identity-art">
        <div className="art-index">
          <span>STACK-K / THE BRAND SYSTEM</span>
          <span>01—2026</span>
        </div>
        <div className="identity-art-center">
          <Logo />
          <div>
            <span>
              STACK <br />
              KNOWLEDGE.
            </span>
            <span>SAVE TIME.</span>
          </div>
        </div>
        <div className="identity-art-foot">
          <Logo secondary />
          <div className="art-palette">
            {palette.map((c) => (
              <i key={c.hex} style={{ background: c.hex }} />
            ))}
          </div>
          <span>A NEW PERSPECTIVE ON LEARNING.</span>
        </div>
      </div>
    );
  if (id === "logo")
    return (
      <div className="project-art sketch-art">
        <span className="art-overline">THE MARK / FROM IDEA TO IDENTITY</span>
        <div>
          <img src="/images/logo-sketch.webp" alt="Actual STACK-K pencil sketch" loading="lazy" />
          <ArrowRight size={26} strokeWidth={1} />
          <Logo />
        </div>
        <span className="art-bottom-label">PENCIL TO PIXEL. POSSIBILITY TO FORM.</span>
      </div>
    );
  if (id === "products")
    return (
      <div className="project-art products-art">
        <img src={featuredVisual.src} alt={featuredVisual.alt} loading="lazy" />
        <div className="products-art-caption">
          <span>EXPERIENCE KNOWLEDGE.</span>
          <p>
            New worlds.
            <br />
            Real possibilities.
          </p>
          <span>AI / VR / HUMAN CONNECTION</span>
        </div>
        <span className="visual-circle">
          <ArrowUpRight size={28} strokeWidth={1} />
        </span>
      </div>
    );
  if (id === "post")
    return (
      <div className="project-art poster-art first-post-art">
        <img
          src="/images/brand-poster.webp"
          alt="The original STACK-K first-ever brand post"
          loading="lazy"
        />
        <span className="art-bottom-label">OUR FIRST HELLO TO THE WORLD.</span>
      </div>
    );
  return (
    <div className="project-art poster-art event-art">
      <img
        src="/images/event-poster.webp"
        alt="The original STAY UP promotional event poster"
        loading="lazy"
      />
      <span className="art-bottom-label">A BRIGHTER PATH TO WHAT COMES NEXT.</span>
    </div>
  );
}

export function PaletteBoard({ onCopy }: { onCopy: (value: string, label: string) => void }) {
  const [selected, setSelected] = useState(0);
  return (
    <div className="palette-board">
      <div className="palette-heading">
        <div>
          <span className="eyebrow">01 / COLOR SCHEME</span>
          <h3>
            Seven shades.
            <br />
            One point of view.
          </h3>
        </div>
        <p>
          An analogous blue-violet palette.
          <br />
          Calm foundations. A curious energy.
        </p>
      </div>
      <div className="swatch-grid">
        {palette.map((c, i) => (
          <button
            key={c.hex}
            aria-label={`Copy ${c.name} ${c.hex}`}
            className={`swatch ${c.light ? "is-light" : ""}`}
            style={{ background: c.hex }}
            onClick={() => {
              setSelected(i);
              onCopy(c.hex, c.name);
            }}
          >
            <span>
              0{i + 1}
              <Copy size={12} />
            </span>
            <span>
              <strong>{c.name}</strong>
              <small>{c.hex}</small>
            </span>
          </button>
        ))}
      </div>
      <div className="color-wheel-row">
        <div
          className="color-wheel"
          role="img"
          aria-label="Color wheel with the adjacent blue, indigo, and violet hues highlighted"
        >
          <div className="wheel-hole" />
          <span className="wheel-dot dot-blue" />
          <span className="wheel-dot dot-indigo" />
          <span className="wheel-dot dot-violet" />
        </div>
        <div>
          <span className="eyebrow">ANALOGOUS, BY DESIGN.</span>
          <p>
            Neighboring hues on the color wheel create a connected visual language. Navy anchors the
            identity; blue and violet bring it to life.
          </p>
          <span className="selected-color-label">
            <i style={{ background: palette[selected].hex }} />
            {palette[selected].name} / {palette[selected].hex}
          </span>
        </div>
      </div>
    </div>
  );
}

export function TypographyBoard() {
  return (
    <div className="typography-board">
      <div className="case-section-label">
        <span>02 / TYPOGRAPHY</span>
        <p>Future-facing character. Everyday clarity.</p>
      </div>
      <div className="type-specimen audiowide-specimen">
        <div className="specimen-meta">
          <span>DISPLAY / REGULAR 400</span>
          <span>BRAND HEADLINES & SELECTED PRODUCT NAMES</span>
        </div>
        <div className="specimen-title">
          <span>Aa</span>
          <h3>Audiowide</h3>
        </div>
        <p className="specimen-alphabet">
          ABCDEFGHIJKLMNOPQRSTUVWXYZ
          <br />
          abcdefghijklmnopqrstuvwxyz
          <br />
          0123456789
        </p>
        <h4>
          EXPERIENCE
          <br />
          KNOWLEDGE.
        </h4>
        <p className="type-note">
          Audiowide is supplied in regular weight; no artificial bold is applied.
        </p>
      </div>
      <div className="type-specimen archivo-specimen">
        <div className="specimen-meta">
          <span>TEXT / REGULAR 400 · MEDIUM 500 · BOLD 700</span>
          <span>BODY COPY, NAVIGATION & CAPTIONS</span>
        </div>
        <div className="specimen-title">
          <span>Aa</span>
          <h3>Archivo</h3>
        </div>
        <p className="specimen-alphabet">
          ABCDEFGHIJKLMNOPQRSTUVWXYZ
          <br />
          abcdefghijklmnopqrstuvwxyz
          <br />
          0123456789
        </p>
        <h4>
          Less memorizing.
          <br />
          <strong>More understanding.</strong>
        </h4>
        <p className="type-note">
          A flexible variable family. Clear, expressive, and built for reading.
        </p>
      </div>
    </div>
  );
}

export function LogoSystem() {
  return (
    <div className="logo-system">
      <div className="case-section-label">
        <span>03 / THE LOGO SYSTEM</span>
        <p>Two expressions. One original identity.</p>
      </div>
      <div className="logo-applications">
        <figure>
          <Logo />
          <figcaption>PRIMARY / SYMBOL ONLY</figcaption>
        </figure>
        <figure>
          <Logo secondary />
          <figcaption>SECONDARY / COMPLETE SIGNATURE</figcaption>
        </figure>
        <figure className="dark-application">
          <Logo />
          <figcaption>DARK APPLICATION / TRANSPARENT PRIMARY</figcaption>
        </figure>
        <figure className="dark-application">
          <Logo secondary />
          <figcaption>DARK APPLICATION / BACKGROUND-FREE SIGNATURE</figcaption>
        </figure>
      </div>
      <div className="proportion-board">
        <div className="proportion-symbol">
          <span className="dimension horizontal">ORIGINAL ASPECT RATIO</span>
          <Logo />
          <span className="clearspace-corner a" />
          <span className="clearspace-corner b" />
        </div>
        <div>
          <h4>Give the idea room.</h4>
          <p>
            Maintain the supplied artwork’s proportions and gradients. Both logos are
            background-free, with generous clear space and no white carrier panels. The original
            blue-violet artwork is preserved.
          </p>
          <a className="text-link" href={brandAssets.secondary} download>
            Download secondary logo <ArrowDownToLine size={15} />
          </a>
          <a className="text-link" href={brandAssets.primary} download>
            Download primary vector <ArrowDownToLine size={15} />
          </a>
        </div>
      </div>
    </div>
  );
}

export function IdentityCaseStudy({ onCopy }: { onCopy: (value: string, label: string) => void }) {
  return (
    <article className="case-study">
      <div className="case-intro">
        <span className="eyebrow">STRATEGY / VISUAL IDENTITY</span>
        <h2>
          BUILDING THE
          <br />
          STACK-K IDENTITY.
        </h2>
        <p>
          A coherent visual language for an educational technology brand. Thoughtful color, distinct
          typography, and an original mark that connects knowledge with experience.
        </p>
      </div>
      <ProjectVisual id="identity" />
      <PaletteBoard onCopy={onCopy} />
      <TypographyBoard />
      <LogoSystem />
      <div className="design-elements">
        <div className="case-section-label">
          <span>04 / DESIGN ELEMENTS</span>
          <p>A system with room to grow.</p>
        </div>
        <div className="design-element-grid">
          <div className="gradient-element">
            <span>BLUE–VIOLET / BRAND GRADIENT</span>
            <div />
            <small>#3157A8 → #302978 → #9E89FA</small>
          </div>
          <div className="shape-element">
            <span>PATHWAYS / DIRECTION & PROGRESS</span>
            <div>
              <i />
              <i />
              <i />
            </div>
            <small>ANGULAR FORMS, OPEN POSSIBILITIES</small>
          </div>
          <div className="line-element">
            <span>CONNECTION / QUIET GRAPHIC DETAILS</span>
            <div>
              <Plus size={26} strokeWidth={1} />
              <span />
              <Plus size={26} strokeWidth={1} />
            </div>
            <small>LINKING IDEAS, PEOPLE, AND EXPERIENCES</small>
          </div>
        </div>
      </div>
      <a className="text-link case-download" href="/images/identity-board.webp" download>
        Download the original identity board <ArrowDownToLine size={16} />
      </a>
    </article>
  );
}

export function LogoCaseStudy() {
  return (
    <article className="case-study">
      <div className="case-intro">
        <span className="eyebrow">EXPLORATION / LOGO DEVELOPMENT</span>
        <h2>
          THE MAKING
          <br />
          OF STACK-K.
        </h2>
        <p>
          The story of a symbol: an S shape, a VR headset, and an open-book-inspired form. From the
          actual pencil sketch to the final digital mark.
        </p>
      </div>
      <div className="logo-process-stages">
        <section className="process-stage">
          <div className="process-image original-sketch">
            <img
              src="/images/logo-sketch.webp"
              alt="Actual original STACK-K pencil sketch"
              loading="lazy"
            />
          </div>
          <div>
            <span className="eyebrow">01 / INITIAL SKETCH</span>
            <h3>
              It started
              <br />
              with a question.
            </h3>
            <p>
              How could one mark connect knowledge and immersion? The initial sketch explores an
              S-shaped headset beside an open-book-inspired K — bringing the idea of Stack Knowledge
              into a single symbol.
            </p>
          </div>
        </section>
        <section className="process-stage reverse">
          <div className="process-image construction-board">
            <div className="logo-fragments construction-whole">
              <Glasses size={36} strokeWidth={1.2} />
              <Plus size={18} strokeWidth={1} />
              <Logo />
              <Plus size={18} strokeWidth={1} />
              <BookOpen size={36} strokeWidth={1.2} />
            </div>
            <div className="construction-labels">
              <span>S / VR HEADSET</span>
              <span>K / OPEN BOOK</span>
            </div>
          </div>
          <div>
            <span className="eyebrow">02 / LOGO CONSTRUCTION</span>
            <h3>
              Two forms.
              <br />A shared meaning.
            </h3>
            <p>
              The rounded S references the immersive view of a VR headset. The open shape of the K
              echoes the pages of a book. The study pairs explanatory icons with the complete
              supplied vector — the official symbol itself is kept intact.
            </p>
          </div>
        </section>
        <section className="process-stage">
          <div className="process-image digital-board">
            <div className="construction-grid" />
            <Logo />
            <span className="digital-board-label">ORIGINAL GRADIENT / ORIGINAL PROPORTIONS</span>
          </div>
          <div>
            <span className="eyebrow">03 / DIGITAL DEVELOPMENT</span>
            <h3>
              From pencil
              <br />
              to possibility.
            </h3>
            <p>
              The refined digital artwork brings the concept into focus: clean contours, balanced
              proportions, and the blue gradients of the supplied STACK-K logo. The final shapes
              remain intact at every size.
            </p>
          </div>
        </section>
      </div>
      <div className="comparison-board">
        <figure>
          <img src="/images/logo-sketch.webp" alt="Before: original pencil sketch" />
          <figcaption>THE FIRST IDEA</figcaption>
        </figure>
        <ArrowRight size={25} strokeWidth={1} />
        <figure>
          <Logo />
          <figcaption>THE FINAL IDENTITY</figcaption>
        </figure>
      </div>
      <div className="film-section-heading">
        <span className="eyebrow">A 15-SECOND MOTION STUDY</span>
        <h3>
          FROM SKETCH
          <br />
          TO IDENTITY.
        </h3>
        <p>
          An animated presentation of the original materials — not invented development footage.
          Press play or explore the timeline.
        </p>
      </div>
      <LogoFilm />
      <div className="case-section-label final-system-label">
        <span>04 / FINAL LOGO SYSTEM</span>
        <p>The mark, ready for the world.</p>
      </div>
      <LogoSystem />
    </article>
  );
}

export function PosterCaseStudy({
  event = false,
  onCopy,
}: {
  event?: boolean;
  onCopy: (value: string, label: string) => void;
}) {
  const image = event ? "/images/event-poster.webp" : "/images/brand-poster.webp";
  return (
    <article className="case-study">
      <div className="case-intro">
        <span className="eyebrow">
          {event ? "04 / PROMOTIONAL EVENT POSTER" : "03 / BRAND POSTER"}
        </span>
        <h2>
          {event ? (
            <>
              STAY UP.
              <br />
              KEEP LEARNING.
            </>
          ) : (
            <>
              OUR FIRST
              <br />
              BRAND STATEMENT.
            </>
          )}
        </h2>
        <p>
          {event
            ? "STAY UP represents continuous learning, creativity, and the motivation to gain knowledge through technology. A visual invitation to keep exploring."
            : "A first impression with a clear point of view. Our original promotional post introduces the STACK-K promise: stack knowledge, save time."}
        </p>
      </div>
      <div className={`full-poster-preview ${event ? "is-event" : ""}`}>
        <img
          src={image}
          alt={
            event
              ? "Original complete STACK-K STAY UP event poster"
              : "Original STACK KNOWLEDGE. SAVE TIME. brand post"
          }
          loading="lazy"
        />
      </div>
      <div className="poster-actions">
        <a className="button button-navy" href={image} target="_blank" rel="noreferrer">
          View {event ? "full-size poster" : "original brand post"} <ArrowUpRight size={16} />
        </a>
        <a className="text-link" href={image} download>
          Download artwork <ArrowDownToLine size={15} />
        </a>
      </div>
      {event ? (
        <div className="poster-explanation">
          <span className="eyebrow">THE IDEA, IN THE DETAILS</span>
          <div>
            <h3>
              A little light.
              <br />A longer journey.
            </h3>
            <dl>
              <div>
                <dt>01 / STAY UP</dt>
                <dd>A headline about sustaining curiosity and the desire to learn.</dd>
              </div>
              <div>
                <dt>02 / THE LIGHT BULBS</dt>
                <dd>Ideas, creativity, and the spark that starts an exploration.</dd>
              </div>
              <div>
                <dt>03 / THE NUMBERED PATH</dt>
                <dd>Learn → Skills → Create → Ideas: knowledge becoming progress.</dd>
              </div>
              <div>
                <dt>04 / STARS & LIGHT</dt>
                <dd>Glowing details that connect the pathway and suggest discovery.</dd>
              </div>
              <div>
                <dt>05 / THE SIGNATURE</dt>
                <dd>The supplied STACK-K branding connects the event to the wider identity.</dd>
              </div>
            </dl>
          </div>
        </div>
      ) : (
        <div className="caption-section">
          <div>
            <span className="eyebrow">THE ORIGINAL CAPTION</span>
            <span>
              Read comfortably or switch to the original styling. Copying keeps your supplied
              caption.
            </span>
          </div>
          <BrandCaption onCopy={onCopy} />
        </div>
      )}
      <div className="poster-design-info">
        <div>
          <span className="eyebrow">COLOR SCHEME / ANALOGOUS BLUE–VIOLET</span>
          <div className="compact-palette">
            {palette.map((c) => (
              <button
                key={c.hex}
                onClick={() => onCopy(c.hex, c.name)}
                aria-label={`Copy ${c.name} ${c.hex}`}
              >
                <i style={{ background: c.hex }} />
                <span>{c.hex}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="eyebrow">TYPOGRAPHY</span>
          <p>
            <span className="font-display">Audiowide</span> /{" "}
            {event ? "Main event headline" : "Main brand headline"}
            <br />
            <strong>Archivo</strong> /{" "}
            {event ? "Supporting event details" : "Supporting information & captions"}
          </p>
        </div>
      </div>
    </article>
  );
}

export function ProductCaseStudy({ onExplore }: { onExplore: (target: string) => void }) {
  return (
    <article className="case-study">
      <div className="case-intro">
        <span className="eyebrow">PRODUCT CONCEPTS / IMMERSIVE LEARNING</span>
        <h2>
          EXPERIENCE
          <br />
          KNOWLEDGE.
        </h2>
        <p>{projects.find((p) => p.id === "products")?.description}</p>
      </div>
      <ProjectVisual id="products" />
      <div className="product-case-list">
        {experiences.map((e, i) => (
          <div key={e.id}>
            <span>0{i + 1}</span>
            <h3>{e.title}</h3>
            <p>{e.detail}</p>
          </div>
        ))}
      </div>
      <button className="button button-navy case-explore" onClick={() => onExplore("experiences")}>
        Explore the seven experiences <ArrowUpRight size={17} />
      </button>
    </article>
  );
}
