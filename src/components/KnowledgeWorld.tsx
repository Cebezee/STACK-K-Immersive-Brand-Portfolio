import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Grip, Pause, Play } from "lucide-react";
import type { ExperimentId } from "./PlayLab";
import styles from "./KnowledgeWorld.module.css";

const journeys = [
  {
    label: "Learn your way",
    title: "Your curiosity. Your next chapter.",
    description:
      "A skill you’ve always wanted to try. A path shaped around you. Start small, explore a little, and see what becomes possible.",
    action: "Try a learning path",
    rotation: -0.35,
    tag: "01 / PERSONAL POSSIBILITY",
  },
  {
    label: "Step into it",
    title: "A different future, within reach.",
    description:
      "Don’t just imagine a new direction. Explore it. Step inside a career concept and discover a different perspective on your potential.",
    action: "Explore Career Simulator",
    rotation: -1.3,
    tag: "02 / IMMERSIVE DISCOVERY",
  },
  {
    label: "Grow together",
    title: "Something to teach. More to learn.",
    description:
      "Knowledge grows when it’s shared. Discover the idea behind Skill Swap — a community where your next lesson starts with another person.",
    action: "Discover Skill Swap",
    rotation: 1.1,
    tag: "03 / HUMAN CONNECTION",
  },
];

type Point = { x: number; y: number; z: number };
const radians = Math.PI / 180;
function spherePoint(latitude: number, longitude: number): Point {
  const lat = latitude * radians;
  const lng = longitude * radians;
  return { x: Math.cos(lat) * Math.sin(lng), y: Math.sin(lat), z: Math.cos(lat) * Math.cos(lng) };
}

const oceanPoints: Point[] = [];
for (let lat = -80; lat <= 80; lat += 4) {
  const step = 4 / Math.max(0.3, Math.cos(lat * radians));
  for (let lng = -180; lng < 180; lng += step) oceanPoints.push(spherePoint(lat, lng));
}
const nodes = [
  { point: spherePoint(39, 14), label: "LEARN" },
  { point: spherePoint(20, 88), label: "EXPLORE" },
  { point: spherePoint(38, -70), label: "CONNECT" },
];

function Globe({ active, spinning, turn }: { active: number; spinning: boolean; turn: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const rotation = useRef(journeys[0].rotation);
  const tilt = useRef(0.13);
  const intent = useRef({ active, turn });
  const [land, setLand] = useState<Point[]>([]);
  const [available, setAvailable] = useState(true);
  const [visible, setVisible] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const controller = new AbortController();
    fetch("/data/globe-land.json", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Globe data unavailable");
        return response.json() as Promise<[number, number][]>;
      })
      .then((points) => setLand(points.map(([lat, lng]) => spherePoint(lat, lng))))
      .catch((error) => {
        if (error.name !== "AbortError") setAvailable(false);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.1,
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    let frame = 0;
    let previousTime = 0;
    let width = element.clientWidth;
    let height = element.clientHeight;
    const previousIntent = intent.current;
    let settling = previousIntent.active !== active || previousIntent.turn !== turn;
    const desired = journeys[active].rotation + turn;
    let target =
      previousIntent.active === active
        ? rotation.current + turn - previousIntent.turn
        : rotation.current +
          Math.atan2(Math.sin(desired - rotation.current), Math.cos(desired - rotation.current));
    intent.current = { active, turn };
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let pageVisible = !document.hidden;

    const project = (point: Point) => {
      const cos = Math.cos(rotation.current);
      const sin = Math.sin(rotation.current);
      const x = point.x * cos + point.z * sin;
      const z = point.z * cos - point.x * sin;
      return {
        x,
        y: point.y * Math.cos(tilt.current) - z * Math.sin(tilt.current),
        z: point.y * Math.sin(tilt.current) + z * Math.cos(tilt.current),
      };
    };

    const render = (time: number) => {
      frame = 0;
      const elapsed = previousTime ? Math.min(time - previousTime, 50) : 16;
      previousTime = time;
      const canMove = visible && pageVisible;
      if (settling && !dragging) {
        const difference = target - rotation.current;
        rotation.current += reduced ? difference : difference * 0.075;
        if (Math.abs(difference) < 0.001) settling = false;
      } else if (spinning && canMove && !dragging) {
        rotation.current += elapsed * 0.000055;
      }

      context.clearRect(0, 0, width, height);
      const radius = Math.min(width * 0.375, height * 0.44);
      const centerX = width / 2;
      const centerY = height / 2;
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.fillStyle = "rgba(233,234,253,0.035)";
      context.fill();
      context.strokeStyle = "rgba(233,234,253,0.22)";
      context.lineWidth = 0.7;
      context.stroke();

      const drawPoints = (points: Point[], isLand: boolean) => {
        for (const point of points) {
          const p = project(point);
          if (p.z < 0) continue;
          const size = isLand ? 2 + p.z * 1.8 : 1;
          context.fillStyle = `rgba(239,242,255,${isLand ? 0.17 + p.z * 0.77 : 0.05 + p.z * 0.08})`;
          context.fillRect(
            centerX + p.x * radius - size / 2,
            centerY - p.y * radius - size / 2,
            size,
            size,
          );
        }
      };
      drawPoints(oceanPoints, false);
      drawPoints(land, true);

      // The route connects learning concepts, not offices or customer locations.
      const start = nodes[active].point;
      const end = nodes[(active + 1) % nodes.length].point;
      const dot = Math.max(-1, Math.min(1, start.x * end.x + start.y * end.y + start.z * end.z));
      const angle = Math.acos(dot);
      context.beginPath();
      let penDown = false;
      for (let i = 0; i <= 64; i++) {
        const t = i / 64;
        const a = Math.sin((1 - t) * angle) / Math.sin(angle);
        const b = Math.sin(t * angle) / Math.sin(angle);
        const lift = 1 + Math.sin(t * Math.PI) * 0.13;
        const p = project({
          x: (a * start.x + b * end.x) * lift,
          y: (a * start.y + b * end.y) * lift,
          z: (a * start.z + b * end.z) * lift,
        });
        if (p.z < 0) {
          penDown = false;
          continue;
        }
        const x = centerX + p.x * radius;
        const y = centerY - p.y * radius;
        if (!penDown) context.moveTo(x, y);
        else context.lineTo(x, y);
        penDown = true;
      }
      context.strokeStyle = "rgba(255,255,255,0.78)";
      context.lineWidth = 1.2;
      context.stroke();

      nodes.forEach((node, index) => {
        const p = project(node.point);
        if (p.z < 0.05) return;
        const x = centerX + p.x * radius;
        const y = centerY - p.y * radius;
        context.beginPath();
        context.arc(x, y, index === active ? 5 : 3, 0, Math.PI * 2);
        context.fillStyle = "white";
        context.fill();
        context.beginPath();
        context.arc(x, y, index === active ? 10 : 7, 0, Math.PI * 2);
        context.strokeStyle = "rgba(255,255,255,0.3)";
        context.stroke();
        if (index !== active) return;
        context.font = "10px Archivo, sans-serif";
        const labelWidth = context.measureText(node.label).width + 20;
        context.fillStyle = "rgba(251,251,252,0.97)";
        context.beginPath();
        context.roundRect(x + 13, y - 13, labelWidth, 25, 4);
        context.fill();
        context.fillStyle = "#151141";
        context.fillText(node.label, x + 23, y + 3);
      });

      if (canMove && (spinning || settling) && !dragging) frame = requestAnimationFrame(render);
    };
    const requestRender = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const resize = () => {
      width = element.clientWidth;
      height = element.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.8);
      element.width = Math.round(width * dpr);
      element.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      requestRender();
    };
    const pointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      dragging = true;
      settling = false;
      lastX = event.clientX;
      lastY = event.clientY;
      element.setPointerCapture(event.pointerId);
      element.dataset.dragging = "true";
    };
    const pointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      rotation.current += (event.clientX - lastX) * 0.006;
      tilt.current = Math.max(
        -0.45,
        Math.min(0.45, tilt.current + (event.clientY - lastY) * 0.002),
      );
      lastX = event.clientX;
      lastY = event.clientY;
      target = rotation.current;
      requestRender();
    };
    const pointerUp = () => {
      dragging = false;
      element.dataset.dragging = "false";
      requestRender();
    };
    const visibilityChange = () => {
      pageVisible = !document.hidden;
      if (pageVisible) {
        previousTime = 0;
        requestRender();
      }
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    element.addEventListener("pointerdown", pointerDown);
    element.addEventListener("pointermove", pointerMove);
    element.addEventListener("pointerup", pointerUp);
    element.addEventListener("pointercancel", pointerUp);
    document.addEventListener("visibilitychange", visibilityChange);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      element.removeEventListener("pointerdown", pointerDown);
      element.removeEventListener("pointermove", pointerMove);
      element.removeEventListener("pointerup", pointerUp);
      element.removeEventListener("pointercancel", pointerUp);
      document.removeEventListener("visibilitychange", visibilityChange);
    };
  }, [active, land, reduced, spinning, turn, visible]);

  return (
    <div className={styles.globe}>
      <canvas
        ref={canvas}
        role="img"
        aria-label="Interactive pixel globe connecting learning, exploration, and human connection. Drag to rotate, or use the rotation buttons."
        data-ready={land.length > 0}
      />
      {!available && (
        <p className={styles.fallback}>
          The globe is unavailable. You can still explore each journey below.
        </p>
      )}
    </div>
  );
}

export default function KnowledgeWorld({
  onExperiment,
  onProduct,
}: {
  onExperiment: (id: ExperimentId) => void;
  onProduct: (id: string) => void;
}) {
  const [active, setActive] = useState(0);
  const [turn, setTurn] = useState(0);
  const [paused, setPaused] = useState(false);
  const [manualPlay, setManualPlay] = useState(false);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced) setManualPlay(false);
  }, [reduced]);
  const spinning = !paused && (!reduced || manualPlay);
  const journey = journeys[active];

  return (
    <section id="world" className={styles.section} aria-labelledby="world-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.topline}>
          <span>
            <i /> KNOWLEDGE HAS NO BORDERS.
          </span>
          <span>STACK-K / AN INTERACTIVE PERSPECTIVE</span>
        </div>
        <div className={styles.stage}>
          <span className={styles.sideLabel}>
            ONE CONNECTED WORLD.
            <br />
            ENDLESS WAYS TO GROW.
          </span>
          <Globe active={active} spinning={spinning} turn={turn} />
          <div className={styles.globeControls}>
            <span>
              <Grip size={14} /> DRAG TO EXPLORE
            </span>
            <div>
              <button aria-label="Rotate globe left" onClick={() => setTurn((t) => t - 0.5)}>
                <ArrowLeft size={16} />
              </button>
              <button
                aria-label={spinning ? "Pause globe rotation" : "Play globe rotation"}
                onClick={() => {
                  if (spinning) setPaused(true);
                  else {
                    setManualPlay(true);
                    setPaused(false);
                  }
                }}
              >
                {spinning ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button aria-label="Rotate globe right" onClick={() => setTurn((t) => t + 0.5)}>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
        <div className={styles.story}>
          <div>
            <p className={styles.eyebrow}>LESS MEMORIZING. MORE BECOMING.</p>
            <h2 id="world-title">
              A WORLD
              <br />
              TO KNOW.
            </h2>
          </div>
          <div className={styles.storyContent}>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: reduced ? 0 : 9 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
            >
              <p className={styles.journeyTag}>{journey.tag}</p>
              <h3>{journey.title}</h3>
              <p>{journey.description}</p>
              <button
                className={styles.action}
                onClick={() =>
                  active === 0
                    ? onExperiment("product")
                    : onProduct(active === 1 ? "career-simulator" : "skill-swap")
                }
              >
                {journey.action}
                <ArrowUpRight size={17} />
              </button>
            </motion.div>
          </div>
        </div>
        <div className={styles.chapters} role="group" aria-label="Choose a knowledge journey">
          {journeys.map((item, index) => (
            <button
              key={item.label}
              aria-pressed={active === index}
              onClick={() => {
                setActive(index);
                setTurn(0);
              }}
            >
              <span>0{index + 1}</span>
              {item.label}
              <ArrowUpRight size={15} />
              {active === index && (
                <motion.i
                  layoutId="world-chapter-indicator"
                  transition={{ type: "spring", stiffness: 280, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
        <p className={styles.note}>
          An interactive brand concept, not a map of STACK-K offices or availability.
        </p>
      </div>
    </section>
  );
}
