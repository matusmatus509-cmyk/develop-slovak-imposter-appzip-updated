import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../utils/cn";

type PerimeterTimerProps = {
  /** Celková dĺžka jedného kola v milisekundách. Čiara obehne displej presne za tento čas. */
  durationMs: number;
  /** Zmena tejto hodnoty spustí čiaru odznova — teda nové kolo / novú otázku. */
  roundKey: number | string;
  /** Keď je false, čiara zastane na aktuálnej pozícii (napr. po prehre). */
  running?: boolean;
  /** Pod touto hranicou zvyšného času sa čiara prepne do urgentného režimu. */
  urgentBelowMs?: number;
  /** Volané v každom animačnom rámci so zvyšným časom. Nespôsobuje re-render tohto komponentu. */
  onTick?: (remainingMs: number) => void;
  /** Volané raz, keď čiara obehne celý displej. */
  onExpire?: () => void;
  /** Odstup stredu čiary od okraja displeja v px. */
  edgeOffset?: number;
  /** Zaoblenie rohov v px — kopíruje zaoblenie displeja telefónu. */
  cornerRadius?: number;
  strokeWidth?: number;
  className?: string;
};

/** Obvod displeja ako jedna spojitá dráha, ktorá začína aj končí v strede horného okraja. */
function buildPerimeterPath(width: number, height: number, offset: number, radius: number) {
  const left = offset;
  const top = offset;
  const right = width - offset;
  const bottom = height - offset;
  const r = Math.max(0, Math.min(radius, (right - left) / 2, (bottom - top) / 2));
  const midX = (left + right) / 2;

  return [
    `M ${midX} ${top}`,
    `H ${right - r}`,
    `A ${r} ${r} 0 0 1 ${right} ${top + r}`,
    `V ${bottom - r}`,
    `A ${r} ${r} 0 0 1 ${right - r} ${bottom}`,
    `H ${left + r}`,
    `A ${r} ${r} 0 0 1 ${left} ${bottom - r}`,
    `V ${top + r}`,
    `A ${r} ${r} 0 0 1 ${left + r} ${top}`,
    `H ${midX}`,
  ].join(" ");
}

/**
 * Časovač nakreslený po celom obvode displeja. Čiara sa postupne plní od stredu horného
 * okraja v smere hodinových ručičiek; keď obehne celý telefón, čas kola vypršal.
 */
export default function PerimeterTimer({
  durationMs,
  roundKey,
  running = true,
  urgentBelowMs = 1500,
  onTick,
  onExpire,
  edgeOffset = 5,
  cornerRadius = 34,
  strokeWidth = 6,
  className,
}: PerimeterTimerProps) {
  const rawId = useId();
  const gradientId = `perimeter-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const hostRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<SVGPathElement | null>(null);
  const headRef = useRef<SVGCircleElement | null>(null);
  const lengthRef = useRef(0);

  const onTickRef = useRef(onTick);
  const onExpireRef = useRef(onExpire);

  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    onTickRef.current = onTick;
    onExpireRef.current = onExpire;
  }, [onTick, onExpire]);

  // Rozmer displeja meriame priamo z hostiteľského prvku, aby čiara sedela aj po otočení telefónu.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const measure = () => {
      const rect = host.getBoundingClientRect();
      setSize((previous) =>
        Math.abs(previous.width - rect.width) < 0.5 && Math.abs(previous.height - rect.height) < 0.5
          ? previous
          : { width: rect.width, height: rect.height }
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    window.visualViewport?.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.visualViewport?.removeEventListener("resize", measure);
    };
  }, []);

  const ready = size.width > 1 && size.height > 1;
  const path = ready ? buildPerimeterPath(size.width, size.height, edgeOffset, cornerRadius) : null;

  // Dĺžku dráhy prepočítame pri každej zmene rozmeru — ešte pred vykreslením, aby čiara nebliknula celá.
  useLayoutEffect(() => {
    const fill = fillRef.current;
    if (!fill || !path) return;

    const total = fill.getTotalLength();
    lengthRef.current = total;
    fill.style.strokeDasharray = `${total}`;
    fill.style.strokeDashoffset = `${total}`;
  }, [path, strokeWidth]);

  useEffect(() => {
    if (!ready || !running || durationMs <= 0) return;

    let frame = 0;
    let expired = false;
    const startedAt = performance.now();

    const draw = (progress: number, remainingMs: number) => {
      const total = lengthRef.current;
      const fill = fillRef.current;
      if (!fill || total <= 0) return;

      fill.style.strokeDashoffset = `${total * (1 - progress)}`;

      const urgent = remainingMs <= urgentBelowMs;
      fill.classList.toggle("is-urgent", urgent);
      hostRef.current?.classList.toggle("is-urgent", urgent);

      const head = headRef.current;
      if (head) {
        const point = fill.getPointAtLength(total * progress);
        head.setAttribute("cx", `${point.x}`);
        head.setAttribute("cy", `${point.y}`);
        head.style.opacity = progress > 0.005 && progress < 0.999 ? "1" : "0";
      }
    };

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const remainingMs = Math.max(0, durationMs - elapsed);
      const progress = Math.min(1, elapsed / durationMs);

      draw(progress, remainingMs);
      onTickRef.current?.(remainingMs);

      if (remainingMs <= 0) {
        if (!expired) {
          expired = true;
          onExpireRef.current?.();
        }
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    draw(0, durationMs);
    onTickRef.current?.(durationMs);
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [ready, running, roundKey, durationMs, urgentBelowMs]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div ref={hostRef} className={cn("perimeter-timer", className)} aria-hidden="true">
      {path && (
        <svg
          className="perimeter-timer-svg"
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          fill="none"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--perimeter-from, #f472b6)" />
              <stop offset="50%" stopColor="var(--perimeter-via, #fb7185)" />
              <stop offset="100%" stopColor="var(--perimeter-to, #fbbf24)" />
            </linearGradient>
          </defs>

          <path className="perimeter-timer-track" d={path} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path
            ref={fillRef}
            className="perimeter-timer-fill"
            d={path}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <circle
            ref={headRef}
            className="perimeter-timer-head"
            r={strokeWidth * 0.9}
            cx={size.width / 2}
            cy={edgeOffset}
            style={{ opacity: 0 }}
          />
        </svg>
      )}
    </div>,
    document.body
  );
}
