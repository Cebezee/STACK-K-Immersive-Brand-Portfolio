# Updating the STACK-K portfolio

This is a React + Vite website in Figma Make, not a native Framer file. Animations use GSAP with ScrollTrigger for scroll-driven reveals and section transitions, Lenis for smooth scrolling (integrated with GSAP), Lottie (`lottie-web`, lazy-loaded light player) for two small looping icons in `public/lottie/`, and CSS transitions for button and hover states. Motion for React is still used for the modal, toast, and mobile menu (AnimatePresence exits). All animation respects `prefers-reduced-motion`. No CMS was connected, so updates are made in source files.

## Main content: `src/data.ts`

- `company`: introduction, history, mission, and vision.
- `projects`: the five selected work entries, titles, descriptions, and categories. Project totals and next-project navigation follow this array automatically.
- `experiences`: the seven product/service concepts and expanded information.
- `palette`: the seven official names and HEX values.
- `brandAssets`: the supplied primary Figma vector, the background-free stacked secondary logo, and its original presentation. These replace the earlier stand-ins.
- `featuredVisual`: the shared VR photograph, alt text, and photographer credit used by the homepage, product showcase, and perspective study.
- `brandCaption`: the latest supplied caption, including its Unicode styling and single line break. `brandCaptionText` derives a reading-friendly presentation without changing the wording; copying always uses the supplied original.
- `team`: names, image paths, roles, and biographies. Roles and biographies are deliberately empty until the team supplies them; no qualifications or roles have been invented.
- `contact.email`: set the actual email address to enable the contact email button.
- `contact.socialLinks`: add actual profiles, for example `{ label: "Instagram", url: "https://www.instagram.com/your-real-profile/" }`. Configured links appear in both Contact and the footer. No placeholder URLs are published.
- `logoProcessVideo`: set a local video path, such as `/videos/logo-process.mp4`, to replace the 15-second animation prototype with a real recorded video.

## Images: `public/images/`

The original sketch, launch post, event poster, identity board, and portraits are retained here. `stack-k-secondary-transparent.webp` is the runtime secondary signature with its paper background removed and its original gradients, proportions, and enclosed visor highlight preserved. `stack-k-secondary-official.webp` retains the original crop, and `secondary-logo-presentation.webp` retains the full supplied presentation. The primary logo is the unchanged transparent Figma-exported SVG in `public/assets/bac77.svg`. Both logo applications are background-free; the old light carrier panels have been removed. Keep both logos' original proportions; do not substitute the earlier horizontal signature.

Product images are illustrative Unsplash photography, not photographs of launched STACK-K products. Their credits are in `photoCredits` and accessible from the footer.
The featured visual is now the brighter VR headset studio photograph by Remy Gieling. Its credit is controlled by `featuredVisual`; the previous dark portrait is no longer used in the rendered website.

## Page and case-study copy

- `src/App.tsx`: homepage, work, about, experiences, team, contact, and footer.
- `src/components/CaseStudies.tsx`: brand identity, typography, logo development, product concepts, and poster explanations.
- `src/components/BrandCaption.tsx` and its CSS module: readable/original caption views with exact-original copying, used in both the brand preview and full poster case study.
- `src/components/TechnologyBridge.tsx` and its CSS module: the high-contrast, animated AI / VR / human connection cards in About. Each opens its actual product concept. The old low-contrast duplicate-logo strip has been removed.
- `src/components/LogoFilm.tsx`: the five exact timing stages of the motion prototype.
- `src/components/PlayLab.tsx`: six explicitly labelled, non-persistent creative prototypes.
- `src/components/PerspectiveStudy.tsx` and its CSS module: the new photographic study and direct access to the live motion field. The hero’s “Try the live motion field” button opens the animation directly.
- `src/components/MotionField.tsx` and its CSS module: a live point-and-contour Canvas study inspired by the uploaded reference. Waves, Orbit, and Stacks are real generated forms; the intensity slider changes their geometry. Play/pause, reset, pointer/touch interaction, offscreen suspension, and live reduced-motion settings are supported. This is not recorded product footage.
- `src/components/ContourRibbon.tsx` and its CSS module: a subtle scroll-linked contour reveal above the footer signature. It does not draw over or modify the official logo.
- `src/components/KnowledgeWorld.tsx`: the reference-inspired, draggable pixel globe and its three interactive learning journeys. It pauses offscreen and honors reduced-motion settings. Geographic data is local; no location data is collected.
- `src/components/PortfolioEnhancements.tsx`: compact brand previews, a quick-play studio rail, wide-screen shortcut navigation in the side margin, and the official secondary-logo footer. The shortcut dock is hidden on narrower screens to avoid covering captions and controls; the main header navigation remains available.
- `src/components/KnowledgeWorld.module.css` and `src/components/PortfolioEnhancements.module.css`: styles for those additions.
- `src/components/InteractionFeedback.tsx`: a shared native-button and link feedback layer. It adds pointer-aware hover lift, small magnetic movement on main controls, spring-like press/release feedback, and clipped click waves without replacing native semantics or click handlers. Touch has press feedback without persistent hover; reduced-motion preferences disable these effects.
- `src/components/OrbitSelector.tsx` and its CSS module: scroll-linked orbital motion inspired by the supplied reference. Its three accessible buttons filter the real experience collection; they are not decorative no-op controls.
- `src/hooks/usePrefersReducedMotion.ts`: live system-motion preferences shared across the page, dialogs, globe, and prototypes. Changing the preference immediately disables movement rather than requiring a reload.
- `src/lib/gsap.ts`: registers GSAP ScrollTrigger and exports the shared `gsap`, `ScrollTrigger`, `REVEAL` timing, and reduced-motion helper used by the page animations.
- `src/lib/smoothScroll.ts`: Lenis lifecycle (`startSmoothScroll`, `stopSmoothScroll`, `scrollToTarget`, `bindAnchorScrolling`). Lenis is started in `src/App.tsx`, stopped while the case-study dialog scroll lock is active, and skipped entirely under reduced-motion preferences.
- `src/hooks/useImageParallax.ts`: scroll-driven image parallax for elements marked `data-parallax`. It animates an independent CSS `translate` property (never `transform`), so hover effects keep working, and it writes nothing under reduced motion.
- `src/components/LottieIcon.tsx`: lazy-loads the light `lottie-web` player for the looping icons in `public/lottie/` (`scroll-cue.json` for the hero scroll cue, `cta-arrow.json` for the footer link). It pauses off-screen, falls back to the lucide icon in an identically sized box (no layout shift), and shows only the static lucide icon under reduced motion.
- `src/index.css`: the responsive layout, font wiring, colors, and interaction styles.

Both fonts are served locally. Archivo is variable (100–900); Audiowide has one regular weight and is not artificially bolded. Complete case studies now open from compact previews so the page is easier to browse; the original content remains available in the case-study dialogs.

## Checks

```sh
pnpm exec tsc --noEmit
pnpm build
pnpm format --check src/App.tsx src/data.ts src/components/CaseStudies.tsx src/components/LogoFilm.tsx src/components/PlayLab.tsx src/components/Modal.tsx src/index.css
```
