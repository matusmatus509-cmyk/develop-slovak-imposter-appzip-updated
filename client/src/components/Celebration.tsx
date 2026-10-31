import type { CSSProperties } from "react";

const COLORS = ["#f8d58b", "#c3acff", "#f5f0ff", "#75baff", "#fb92a8"];

/** A finite, deterministic celebration shared by results screens. */
export default function Celebration() {
  return (
    <div className="result-celebration" aria-hidden="true">
      {Array.from({ length: 42 }, (_, index) => (
        <i key={index} style={{
          "--piece-left": `${(index * 37 + 7) % 100}%`,
          "--piece-delay": `${(index % 9) * .09}s`,
          "--piece-duration": `${2.5 + (index % 5) * .23}s`,
          "--piece-turn": `${180 + index * 31}deg`,
          "--piece-drift": `${(index % 2 ? 1 : -1) * (25 + index % 60)}px`,
          backgroundColor: COLORS[index % COLORS.length],
          width: `${5 + index % 5}px`,
          height: `${8 + index % 7}px`,
          borderRadius: index % 3 === 0 ? "50%" : "2px",
        } as CSSProperties} />
      ))}
    </div>
  );
}
