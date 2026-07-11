import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../utils/cn";

export function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0b0a1a]">
      <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-fuchsia-600/30 blur-[100px]" />
      <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-indigo-600/30 blur-[100px]" />
      <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-orange-500/20 blur-[110px]" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full text-white">
      <Background />
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-8 pt-6">
        {children}
      </div>
    </div>
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-base font-bold transition active:scale-[0.97] disabled:opacity-40 disabled:active:scale-100";
  const variants: Record<string, string> = {
    primary:
      "bg-gradient-to-r from-orange-500 via-pink-500 to-fuchsia-600 text-white shadow-lg shadow-fuchsia-900/40 hover:brightness-110",
    secondary:
      "bg-white/10 text-white border border-white/15 backdrop-blur hover:bg-white/15",
    ghost: "bg-transparent text-white/70 hover:text-white",
    danger:
      "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-900/40",
  };
  return (
    <button
      className={cn(base, variants[variant], fullWidth && "w-full", className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function Chip({
  active,
  onClick,
  children,
  className,
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition active:scale-95",
        active
          ? "border-fuchsia-400/60 bg-gradient-to-r from-orange-500/90 to-fuchsia-600/90 text-white shadow-md shadow-fuchsia-900/40"
          : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10",
        className
      )}
    >
      {children}
    </button>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-left"
    >
      <span>
        <span className="block text-sm font-bold text-white">{label}</span>
        {description && (
          <span className="mt-0.5 block text-xs text-white/50">
            {description}
          </span>
        )}
      </span>
      <span
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition",
          checked ? "bg-gradient-to-r from-orange-500 to-fuchsia-600" : "bg-white/15"
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-5 w-5 rounded-full bg-white transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </span>
    </button>
  );
}

export function Stepper({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl font-bold disabled:opacity-30"
      >
        −
      </button>
      <span className="w-8 text-center text-xl font-extrabold">{value}</span>
      <button
        type="button"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl font-bold disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}

export function TopBar({
  title,
  onBack,
  right,
}: {
  title?: string;
  onBack?: () => void;
  right?: ReactNode;
}) {
  return (
    <div className="mb-4 flex h-11 items-center justify-between">
      {onBack ? (
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg"
        >
          ←
        </button>
      ) : (
        <span className="w-10" />
      )}
      {title && (
        <span className="text-sm font-bold uppercase tracking-wider text-white/70">
          {title}
        </span>
      )}
      {right ?? <span className="w-10" />}
    </div>
  );
}
