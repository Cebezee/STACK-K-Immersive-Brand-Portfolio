import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import styles from "./MotionField.module.css";

type Form = "waves" | "orbit" | "stacks";
const forms: { id: Form; name: string; description: string }[] = [
  { id: "waves", name: "Waves", description: "A contour landscape, shaped by movement." },
  { id: "orbit", name: "Orbit", description: "Ideas connecting in a continuous form." },
  { id: "stacks", name: "Stacks", description: "Small layers. A bigger understanding." },
];
const columns = 64;
const rows = 23;

function position(form: Form, u: number, v: number, time: number, amplitude: number) {
  if (form === "orbit") {
    const theta = u * Math.PI * 2;
    const phi = v * Math.PI * 2;
    const radius = 0.63 + Math.cos(phi + time * 0.35) * (0.12 + amplitude * 0.12);
    return [Math.cos(theta) * radius, Math.sin(theta) * radius * 0.86, Math.sin(phi) * 0.23];
  }
  if (form === "stacks") {
    const theta = u * Math.PI * 2;
    const radius = 0.51 + Math.sin(v * Math.PI + time * 0.25) * amplitude * 0.2;
    return [
      Math.cos(theta + v * 0.55) * radius,
      (v - 0.5) * 1.2 + Math.sin(theta * 2 + time) * amplitude * 0.07,
      Math.sin(theta + v * 0.55) * radius,
    ];
  }
  const x = (u - 0.5) * 2.05;
  const z = (v - 0.5) * 1.3;
  const ridge = Math.sin(u * Math.PI * 3 + time) * Math.cos(v * Math.PI * 1.6 + time * 0.38);
  const peak = Math.exp(-((u - 0.57) ** 2 + (v - 0.45) ** 2) * 17);
  return [x, ridge * amplitude * 0.25 - peak * amplitude * 0.28, z];
}

function FieldCanvas({
  form,
  intensity,
  playing,
  reset,
}: {
  form: Form;
  intensity: number;
  playing: boolean;
  reset: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const time = useRef(0);
  const points = useRef<Float32Array<ArrayBufferLike>>(new Float32Array());
  const pointer = useRef({ x: 0, y: 0 });
  const intent = useRef({ form, intensity, reset });
  const [visible, setVisible] = useState(false);
  const [available, setAvailable] = useState(true);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.08,
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    time.current = 0;
    pointer.current = { x: 0, y: 0 };
  }, [reset]);

  useEffect(() => {
    const element = ref.current;
    const context = element?.getContext("2d");
    if (!element || !context) {
      setAvailable(false);
      return;
    }
    const previous = intent.current;
    const morphing =
      points.current.length > 0 &&
      (previous.form !== form || previous.intensity !== intensity || previous.reset !== reset);
    intent.current = { form, intensity, reset };
    const from = points.current.slice();
    if (points.current.length !== columns * rows * 3)
      points.current = new Float32Array(columns * rows * 3);
    const start = performance.now();
    let frame = 0;
    let disposed = false;
    let hasDrawn = false;
    let last = 0;
    let width = element.clientWidth;
    let height = element.clientHeight;
    let pageVisible = !document.hidden;

    const draw = (now: number) => {
      if (disposed) return;
      frame = 0;
      const delta = last ? Math.min(50, now - last) : 16;
      if (playing && visible && pageVisible && last && delta < 28) {
        frame = requestAnimationFrame(draw);
        return;
      }
      last = now;
      if (playing && visible && pageVisible) time.current += delta * 0.00065;
      const fraction = morphing && !reduced ? Math.min(1, (now - start) / 650) : 1;
      const blend = 1 - (1 - fraction) ** 3;
      const radius = Math.min(width * 0.38, height * 0.61);
      const yaw = time.current * 0.08 + (reduced ? 0 : pointer.current.x * 0.16);
      const tilt = 0.58 + (reduced ? 0 : pointer.current.y * 0.1);
      const projected: { x: number; y: number; depth: number }[] = [];
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const index = (row * columns + column) * 3;
          const target = position(
            form,
            column / (columns - 1),
            row / (rows - 1),
            time.current,
            intensity / 100,
          );
          for (let axis = 0; axis < 3; axis++)
            points.current[index + axis] = morphing
              ? from[index + axis] + (target[axis] - from[index + axis]) * blend
              : target[axis];
          const x = points.current[index];
          const y = points.current[index + 1];
          const z = points.current[index + 2];
          const rotatedX = x * Math.cos(yaw) + z * Math.sin(yaw);
          const rotatedZ = z * Math.cos(yaw) - x * Math.sin(yaw);
          const rotatedY = y * Math.cos(tilt) - rotatedZ * Math.sin(tilt);
          const depth = y * Math.sin(tilt) + rotatedZ * Math.cos(tilt);
          const perspective = 1.6 / (1.6 + depth * 0.16);
          projected.push({
            x: width / 2 + rotatedX * radius * perspective,
            y: height / 2 + rotatedY * radius * perspective,
            depth,
          });
        }
      }
      context.clearRect(0, 0, width, height);
      for (let row = 0; row < rows; row++) {
        context.beginPath();
        for (let column = 0; column < columns; column++) {
          const point = projected[row * columns + column];
          if (!column) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        }
        context.strokeStyle = row % 3 ? "rgba(158,137,250,0.22)" : "rgba(233,234,253,0.31)";
        context.lineWidth = 0.65;
        context.stroke();
      }
      projected.forEach((point, index) => {
        const depth = Math.max(0, Math.min(1, (point.depth + 1) / 2));
        const size = 1.05 + depth * 0.7;
        context.fillStyle =
          index % 7 === 0
            ? `rgba(158,137,250,${0.4 + depth * 0.4})`
            : `rgba(233,234,253,${0.24 + depth * 0.6})`;
        context.fillRect(point.x - size / 2, point.y - size / 2, size, size);
      });
      hasDrawn = true;
      if (visible && pageVisible && (playing || fraction < 1)) frame = requestAnimationFrame(draw);
    };
    const requestDraw = () => {
      if (!disposed && !frame) frame = requestAnimationFrame(draw);
    };
    const resize = () => {
      if (disposed) return;
      width = element.clientWidth;
      height = element.clientHeight;
      const dpr = Math.min(1.7, window.devicePixelRatio || 1);
      const backingWidth = Math.round(width * dpr);
      const backingHeight = Math.round(height * dpr);
      const changed = element.width !== backingWidth || element.height !== backingHeight;
      // Reassigning even an unchanged canvas size clears its bitmap and drawing state.
      if (changed) {
        element.width = backingWidth;
        element.height = backingHeight;
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      if (changed || !hasDrawn) requestDraw();
    };
    const move = (event: PointerEvent) => {
      if (reduced) return;
      if (event.pointerType === "touch" && !element.hasPointerCapture(event.pointerId)) return;
      const rect = element.getBoundingClientRect();
      pointer.current = {
        x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
      };
      requestDraw();
    };
    const down = (event: PointerEvent) => {
      if (event.button === 0) element.setPointerCapture(event.pointerId);
    };
    const leave = () => {
      if (!pointer.current.x && !pointer.current.y) return;
      pointer.current = { x: 0, y: 0 };
      requestDraw();
    };
    const visibility = () => {
      pageVisible = !document.hidden;
      if (pageVisible) {
        last = 0;
        requestDraw();
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerdown", down);
    element.addEventListener("pointerleave", leave);
    element.addEventListener("pointercancel", leave);
    document.addEventListener("visibilitychange", visibility);
    resize();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointerleave", leave);
      element.removeEventListener("pointercancel", leave);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [form, intensity, playing, reduced, reset, visible]);

  return (
    <div className={styles.screen}>
      <div className={styles.screenTop}>
        <span>
          <i /> LIVE GENERATIVE STUDY
        </span>
        <span>{playing ? "IN MOTION" : "PAUSED"}</span>
      </div>
      <canvas
        ref={ref}
        role="img"
        aria-label={`Interactive ${form} particle and contour field. Move the pointer or drag horizontally to explore.`}
        data-form={form}
        data-intensity={intensity}
        data-playing={playing}
      />
      {!available && (
        <p className={styles.unavailable}>
          Your browser cannot display this canvas study. You can still explore the image view.
        </p>
      )}
      <div className={styles.screenBottom}>
        <span>KNOWLEDGE, IN A DIFFERENT FORM.</span>
        <span>{String(forms.findIndex((item) => item.id === form) + 1).padStart(2, "0")} / 03</span>
      </div>
    </div>
  );
}

export default function MotionField() {
  const reduced = usePrefersReducedMotion();
  const [form, setForm] = useState<Form>("waves");
  const [intensity, setIntensity] = useState(55);
  const [playing, setPlaying] = useState(!reduced);
  const [reset, setReset] = useState(0);
  useEffect(() => {
    if (reduced) setPlaying(false);
  }, [reduced]);
  return (
    <div className={styles.field}>
      <FieldCanvas form={form} intensity={intensity} playing={playing} reset={reset} />
      <div className={styles.forms} role="group" aria-label="Motion field shape">
        {forms.map((item) => (
          <button key={item.id} aria-pressed={form === item.id} onClick={() => setForm(item.id)}>
            {item.name}
          </button>
        ))}
      </div>
      <p className={styles.description}>{forms.find((item) => item.id === form)?.description}</p>
      <label className={styles.intensity}>
        <span>
          Motion intensity <strong>{intensity}%</strong>
        </span>
        <input
          type="range"
          min="10"
          max="100"
          step="5"
          value={intensity}
          aria-label="Motion intensity"
          onChange={(event) => setIntensity(Number(event.target.value))}
        />
      </label>
      <div className={styles.actions}>
        <button
          className="button button-navy"
          onClick={() => setPlaying((value) => !value)}
          aria-label={playing ? "Pause motion field" : "Play motion field"}
        >
          {playing ? <Pause size={14} /> : <Play size={14} />}
          {playing ? "Pause motion" : "Play motion"}
        </button>
        <button
          className="text-link"
          onClick={() => {
            setForm("waves");
            setIntensity(55);
            setReset((value) => value + 1);
          }}
        >
          Reset the study <RotateCcw size={14} />
        </button>
      </div>
      <p className={styles.note}>
        A live Canvas prototype, not recorded product footage. Choose a form, adjust the intensity,
        or move across the field.
      </p>
    </div>
  );
}
