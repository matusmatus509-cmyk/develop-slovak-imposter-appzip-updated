import type { ButtonHTMLAttributes, ReactNode, SVGProps } from "react";
import { Icons, type IconsType } from "./icons";
import { designTokens } from "../utils/designTokens";
import appTexture from "../assets/app-texture.jpg";

// ── Type Definitions ──────────────────────────────────────────────────

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

type IconName = keyof IconsType;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success" | "outline";
  size?: "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  children: ReactNode;
}

interface ChipProps {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  variant?: "default" | "outline" | "filled";
  leftIcon?: IconName;
  rightIcon?: IconName;
}

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface StepperProps {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  label?: string;
}

interface TopBarProps {
  title?: string;
  onBack?: () => void;
  right?: ReactNode;
  showBack?: boolean;
}

interface ShellProps {
  children: ReactNode;
  className?: string;
  noBackground?: boolean;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
}

interface CardProps {
  children: ReactNode;
  variant?: "base" | "elevated" | "outlined" | "gradient";
  className?: string;
  onClick?: () => void;
}

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "danger" | "warning" | "info" | "purple";
  size?: "sm" | "md" | "lg";
  className?: string;
  dot?: boolean;
}

interface AvatarProps {
  children: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  variant?: "default" | "gradient" | "image";
  src?: string;
  alt?: string;
  status?: "online" | "offline" | "busy" | "away";
  className?: string;
}

interface ProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "danger" | "warning" | "info";
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

interface SkeletonProps {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
  className?: string;
}

interface TooltipProps {
  content: ReactNode;
  children: ReactElement;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

interface ToastProps {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
  action?: { label: string; onClick: () => void };
}

// ── Helper ────────────────────────────────────────────────────────────

const { cn, componentStyles, colors, spacing, borderRadius, typography } = designTokens;

function Icon({ name, size = 24, className = "", ...props }: IconProps & { name: IconName }) {
  const IconComponent = Icons[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} className={className} {...props} />;
}

// ── Button ────────────────────────────────────────────────────────────

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = "",
  children,
  style,
  ...props
}: ButtonProps) {
  const sizeStyles = {
    sm: { padding: `${spacing.xs} ${spacing.sm}`, fontSize: typography.fontSize.sm, gap: spacing.xs, height: "32px" },
    md: { padding: `${spacing.sm} ${spacing.md}`, fontSize: typography.fontSize.base, gap: spacing.sm, height: "44px" },
    lg: { padding: `${spacing.md} ${spacing.lg}`, fontSize: typography.fontSize.lg, gap: spacing.md, height: "52px" },
    xl: { padding: `${spacing.md} ${spacing.xl}`, fontSize: typography.fontSize.xl, gap: spacing.md, height: "60px" },
  }[size];

  const variantStyles = {
    primary: {
      background: colors.gradient.primary,
      color: colors.text.primary,
      boxShadow: "0 4px 14px 0 rgba(168, 85, 247, 0.4)",
      "&:hover:not(:disabled)": {
        background: colors.gradient.primaryHover,
        boxShadow: "0 6px 20px 0 rgba(168, 85, 247, 0.5)",
        transform: "scale(1.02)",
      },
    },
    secondary: {
      background: colors.bg.card,
      color: colors.text.primary,
      border: `1px solid ${colors.border.medium}`,
      "&:hover:not(:disabled)": {
        background: colors.bg.cardHover,
        borderColor: colors.border.strong,
      },
    },
    ghost: {
      background: "transparent",
      color: colors.text.secondary,
      "&:hover:not(:disabled)": {
        background: colors.bg.card,
        color: colors.text.primary,
      },
    },
    danger: {
      background: colors.gradient.danger,
      color: colors.text.primary,
      boxShadow: "0 4px 14px 0 rgba(239, 68, 68, 0.4)",
      "&:hover:not(:disabled)": {
        boxShadow: "0 6px 20px 0 rgba(239, 68, 68, 0.5)",
        transform: "scale(1.02)",
      },
    },
    success: {
      background: colors.gradient.success,
      color: colors.text.primary,
      boxShadow: "0 4px 14px 0 rgba(34, 197, 94, 0.4)",
      "&:hover:not(:disabled)": {
        boxShadow: "0 6px 20px 0 rgba(34, 197, 94, 0.5)",
        transform: "scale(1.02)",
      },
    },
    outline: {
      background: "transparent",
      color: colors.text.primary,
      border: `2px solid ${colors.border.strong}`,
      "&:hover:not(:disabled)": {
        background: colors.bg.card,
        borderColor: colors.semantic.purpleBorder,
      },
    },
  }[variant];

  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        "app-button inline-flex items-center justify-center font-bold transition-all duration-200",
        "active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0a1a]",
        fullWidth && "w-full",
        className
      )}
      style={{
        ...componentStyles.button.base,
        ...sizeStyles,
        ...variantStyles,
        ...(isDisabled && componentStyles.button.disabled),
        ...style,
      } as any}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          style={{ width: "1em", height: "1em" }}
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && leftIcon && <Icon name={leftIcon} size={size === "sm" ? 16 : size === "md" ? 18 : 20} />}
      <span style={{ whiteSpace: "nowrap" }}>{children}</span>
      {!loading && rightIcon && <Icon name={rightIcon} size={size === "sm" ? 16 : size === "md" ? 18 : 20} />}
    </button>
  );
}

// ── Chip ──────────────────────────────────────────────────────────────

export function Chip({
  active = false,
  onClick,
  children,
  className = "",
  variant = "default",
  leftIcon,
  rightIcon,
}: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0a1a]",
        variant === "default" && active
          ? "bg-gradient-to-r from-orange-500 via-pink-500 to-fuchsia-600 text-white shadow-md shadow-fuchsia-900/40"
          : variant === "default"
          ? "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
          : variant === "outline"
          ? active
            ? "border-fuchsia-400/60 bg-gradient-to-r from-orange-500/90 to-fuchsia-600/90 text-white shadow-md shadow-fuchsia-900/40"
            : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
          : variant === "filled"
          ? active
            ? "bg-gradient-to-r from-orange-500 to-fuchsia-600 text-white shadow-md"
            : "bg-white/10 text-white/60 hover:bg-white/20"
          : "",
        className
      )}
    >
      {leftIcon && <Icon name={leftIcon} size={16} />}
      {children}
      {rightIcon && <Icon name={rightIcon} size={16} />}
    </button>
  );
}

// ── Toggle ────────────────────────────────────────────────────────────

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-left transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0a1a]",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span className="flex-1">
        <span className="block text-sm font-bold text-white">{label}</span>
        {description && (
          <span className="mt-0.5 block text-xs text-white/50">{description}</span>
        )}
      </span>
      <span
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-all",
          checked
            ? "bg-gradient-to-r from-orange-500 to-fuchsia-600"
            : "bg-white/15"
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

// ── Stepper ────────────────────────────────────────────────────────────

export function Stepper({
  value,
  min,
  max,
  onChange,
  disabled = false,
  label,
}: StepperProps) {
  return (
    <div className="flex items-center gap-4">
      {label && (
        <span className="text-sm font-bold text-white/70 uppercase tracking-wider min-w-[100px]">
          {label}
        </span>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => !disabled && onChange(Math.max(min, value - 1))}
          disabled={disabled || value <= min}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl font-bold transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50",
            (disabled || value <= min) && "opacity-30 cursor-not-allowed"
          )}
        >
          −
        </button>
        <span className="w-8 text-center text-xl font-extrabold font-display text-white">
          {value}
        </span>
        <button
          type="button"
          onClick={() => !disabled && onChange(Math.min(max, value + 1))}
          disabled={disabled || value >= max}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl font-bold transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50",
            (disabled || value >= max) && "opacity-30 cursor-not-allowed"
          )}
        >
          +
        </button>
      </div>
    </div>
  );
}

// ── TopBar ────────────────────────────────────────────────────────────

export function TopBar({
  title,
  onBack,
  right,
  showBack = true,
}: TopBarProps) {
  return (
    <div className="relative z-30 mb-5 flex h-11 items-center justify-between">
      {showBack && onBack ? (
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[#151b27]/85 text-lg shadow-lg shadow-black/20 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/15 active:translate-y-0 active:scale-95"
          aria-label="Späť"
        >
          <Icon name="chevronLeft" size={20} />
        </button>
      ) : (
        <span className="w-10" />
      )}
      {title && (
        <span className="rounded-full border border-white/[.08] bg-black/15 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[.16em] text-white/65 backdrop-blur-lg">
          {title}
        </span>
      )}
      {right ?? (showBack && !onBack ? <span className="w-10" /> : null)}
    </div>
  );
}

// ── Shell ──────────────────────────────────────────────────────────────

function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#080d16]">
      <img src={appTexture} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#080d16]/5 via-[#080d16]/25 to-[#080d16]/65" />
      <div className="absolute -top-36 -left-28 h-80 w-80 rounded-full bg-violet-600/12 blur-[110px]" />
      <div className="absolute top-[38%] -right-28 h-80 w-80 rounded-full bg-cyan-600/10 blur-[115px]" />
      <div className="absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-orange-500/10 blur-[110px]" />
    </div>
  );
}

export function Shell({ children, className = "", noBackground = false }: ShellProps) {
  return (
    <div className={cn("relative min-h-screen w-full bg-transparent text-white", className)}>
      {!noBackground && <Background />}
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-8 pt-6">
        {children}
      </div>
    </div>
  );
}

// ── Input ──────────────────────────────────────────────────────────────

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-semibold text-white/70"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
            <Icon name={leftIcon} size={20} />
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            "w-full rounded-2xl border bg-white/5 px-4 py-3 text-base font-semibold text-white placeholder-white/30 outline-none transition-all",
            "focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            leftIcon && "pl-12",
            rightIcon && "pr-12",
            error && "border-red-500/40 focus:border-red-500/60 focus:ring-red-500/20",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={cn(error && errorId, helperText && helperId)}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
            <Icon name={rightIcon} size={20} />
          </div>
        )}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helperId} className="mt-1.5 text-sm text-white/40">
          {helperText}
        </p>
      )}
    </div>
  );
}

// ── Card ────────────────────────────────────────────────────────────────

export function Card({
  children,
  variant = "base",
  className = "",
  onClick,
}: CardProps) {
  return (
    <div
      className={cn(
        "backdrop-blur-xl transition-all duration-200",
        variant === "base" && "border border-white/10 bg-[#111824]/78 shadow-lg shadow-black/15",
        variant === "elevated" && "border border-white/15 bg-[#141b28]/88 shadow-xl shadow-black/30",
        variant === "outlined" && "border border-white/15 bg-[#0d131e]/35",
        variant === "gradient" && "border border-transparent bg-gradient-to-br from-white/10 to-white/5 shadow-xl shadow-black/20",
        onClick && "cursor-pointer active:scale-[0.98]",
        className
      )}
      style={{
        borderRadius: borderRadius.xl,
        ...(variant === "gradient" && {
          background: "linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.05)) padding-box, linear-gradient(135deg, #a855f7, #ec4899) border-box",
        }),
      } as any}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// ── Badge ───────────────────────────────────────────────────────────────

export function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
  dot = false,
}: BadgeProps) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  }[size];

  const variantStyles = {
    default: "bg-white/10 text-white/70 border border-white/10",
    success: "bg-green-500/20 text-green-300 border border-green-500/30",
    danger: "bg-red-500/20 text-red-300 border border-red-500/30",
    warning: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    info: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
    purple: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold border",
        sizeStyles,
        variantStyles,
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === "success" && "bg-green-400",
            variant === "danger" && "bg-red-400",
            variant === "warning" && "bg-amber-400",
            variant === "info" && "bg-cyan-400",
            variant === "purple" && "bg-purple-400",
            variant === "default" && "bg-white/50"
          )}
        />
      )}
      {children}
    </span>
  );
}

// ── Avatar ──────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-gradient-to-br from-red-500 to-pink-500",
  "bg-gradient-to-br from-orange-500 to-amber-500",
  "bg-gradient-to-br from-amber-500 to-yellow-500",
  "bg-gradient-to-br from-emerald-500 to-teal-500",
  "bg-gradient-to-br from-cyan-500 to-sky-500",
  "bg-gradient-to-br from-blue-500 to-indigo-500",
  "bg-gradient-to-br from-violet-500 to-purple-500",
  "bg-gradient-to-br from-fuchsia-500 to-pink-500",
  "bg-gradient-to-br from-rose-500 to-red-500",
  "bg-gradient-to-br from-slate-500 to-gray-500",
  "bg-gradient-to-br from-lime-500 to-green-500",
  "bg-gradient-to-br from-indigo-500 to-blue-500",
];

function getColorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function Avatar({
  children,
  size = "md",
  variant = "default",
  src,
  alt,
  status,
  className = "",
}: AvatarProps) {
  const sizeStyles = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl",
    "2xl": "h-20 w-20 text-2xl",
  }[size];

  const statusSize = {
    xs: "h-1.5 w-1.5",
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3 w-3",
    xl: "h-4 w-4",
    "2xl": "h-5 w-5",
  }[size];

  const statusColors = {
    online: "bg-green-400",
    offline: "bg-gray-500",
    busy: "bg-red-400",
    away: "bg-amber-400",
  };

  const content = src ? (
    <img src={src} alt={alt || ""} className="h-full w-full rounded-full object-cover" />
  ) : (
    <span className="flex h-full w-full items-center justify-center font-black select-none">
      {children}
    </span>
  );

  return (
    <div className={cn("relative inline-flex", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-full overflow-hidden select-none",
          sizeStyles,
          variant === "default" && getColorForName(typeof children === "string" ? children : "A"),
          variant === "gradient" && "bg-gradient-to-br from-violet-500 to-cyan-500",
        )}
        style={{
          boxShadow: variant === "gradient" ? "0 0 0 3px currentColor, 0 0 20px 6px currentColor" : undefined,
          color: variant === "gradient" ? "currentColor" : undefined,
        } as any}
      >
        {content}
      </div>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-[#0b0a1a]",
            statusSize,
            statusColors[status]
          )}
        />
      )}
    </div>
  );
}

// ── Progress ────────────────────────────────────────────────────────────

export function Progress({
  value,
  max = 100,
  size = "md",
  variant = "default",
  showLabel = false,
  animated = false,
  className = "",
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const sizeStyles = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  }[size];

  const variantColors = {
    default: "bg-gradient-to-r from-orange-500 via-pink-500 to-fuchsia-600",
    success: "bg-green-500",
    danger: "bg-red-500",
    warning: "bg-amber-500",
    info: "bg-cyan-500",
  }[variant];

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/40 mb-1.5">
          <span>Progress</span>
          <span className="tabular-nums">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={cn(
          "w-full rounded-full bg-white/10 overflow-hidden",
          sizeStyles
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-linear",
            variantColors,
            animated && "animate-pulse"
          )}
          style={{
            width: `${percentage}%`,
            ...(animated && { animation: "pulse 2s ease-in-out infinite" }),
          } as any}
        />
      </div>
    </div>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────────────

export function Skeleton({
  variant = "text",
  width = "100%",
  height,
  animation = "pulse",
  className = "",
}: SkeletonProps) {
  const baseStyles = {
    background: "linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)",
    backgroundSize: "200% 100%",
    borderRadius: borderRadius.lg,
  };

  const variantStyles = {
    text: { height: height || "1rem", borderRadius: borderRadius.md },
    circular: { 
      width: height || "3rem", 
      height: height || "3rem", 
      borderRadius: borderRadius.full 
    },
    rectangular: { 
      width: width, 
      height: height || "8rem", 
      borderRadius: borderRadius.xl 
    },
  }[variant];

  return (
    <div
      className={cn(
        "overflow-hidden",
        animation === "pulse" && "animate-pulse",
        animation === "wave" && "animate-[shimmer_1.5s_infinite]",
        className
      )}
      style={{
        ...baseStyles,
        ...variantStyles,
        width: variant === "text" ? width : variantStyles.width,
      } as any}
    />
  );
}

// ── Tooltip ──────────────────────────────────────────────────────────────

export function Tooltip({
  content,
  children,
  position = "top",
  delay = 200,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  const positionStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }[position];

  const arrowStyles = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-white/10",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-white/10",
    left: "left-full top-1/2 -translate-y-1/2 border-l-white/10",
    right: "right-full top-1/2 -translate-y-1/2 border-r-white/10",
  }[position];

  return (
    <div className="relative inline-block" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      {visible && (
        <div
          className={cn(
            "absolute z-50 px-3 py-2 text-xs font-medium text-white whitespace-nowrap rounded-lg bg-white/10 backdrop-blur border border-white/10 shadow-xl",
            positionStyles
          )}
          role="tooltip"
        >
          {content}
          <div
            className={cn(
              "absolute w-0 h-0 border-4 border-transparent",
              arrowStyles
            )}
          />
        </div>
      )}
    </div>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  closeOnOverlayClick = true,
  showCloseButton = true,
}: ModalProps) {
  if (!isOpen) return null;

  const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-[90vw]",
  }[size];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={closeOnOverlayClick ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={description ? "modal-description" : undefined}
    >
      <div
        className={cn(
          "w-full rounded-3xl bg-[#12101f]/95 border border-white/10 shadow-2xl shadow-black/50 backdrop-blur-xl animate-pop-in",
          sizeStyles
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between gap-4 p-6 pb-4 border-b border-white/10">
            <div className="flex-1">
              {title && (
                <h2 id="modal-title" className="text-xl font-black text-white">
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-description" className="mt-1 text-sm text-white/50">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/15 hover:text-white"
                aria-label="Zavrieť"
              >
                <Icon name="x" size={20} />
              </button>
            )}
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ── Toast ────────────────────────────────────────────────────────────────

export function Toast({
  id,
  type,
  title,
  message,
  duration = 4000,
  onClose,
  action,
}: ToastProps) {
  const [visible, setVisible] = useState(true);
  
  const typeStyles = {
    success: "border-green-500/40 bg-green-500/10",
    error: "border-red-500/40 bg-red-500/10",
    warning: "border-amber-500/40 bg-amber-500/10",
    info: "border-cyan-500/40 bg-cyan-500/10",
  }[type];

  const icons = {
    success: <Icon name="circleCheck" size={20} className="text-green-400" />,
    error: <Icon name="circleX" size={20} className="text-red-400" />,
    warning: <Icon name="alertTriangle" size={20} className="text-amber-400" />,
    info: <Icon name="info" size={20} className="text-cyan-400" />,
  }[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => onClose(id), 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 w-full max-w-sm rounded-2xl border p-4 shadow-2xl shadow-black/50 animate-slide-in-from-right",
        typeStyles
      )}
      role="alert"
    >
      <div className="flex gap-3">
        <div className="shrink-0">{icons}</div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-white">{title}</p>
          {message && <p className="mt-1 text-sm text-white/70">{message}</p>}
        </div>
        <button
          onClick={() => { setVisible(false); setTimeout(() => onClose(id), 300); }}
          className="shrink-0 text-white/40 hover:text-white transition-colors"
          aria-label="Zavrieť"
        >
          <Icon name="x" size={18} />
        </button>
      </div>
      {action && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <Button variant="ghost" size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}

// ── Toast Container ────────────────────────────────────────────────────

interface ToastContainerProps {
  toasts: Array<ToastProps & { id: string }>;
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}

// ── Missing imports ────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import type { ReactElement } from "react";

export { Icon } from "./icons";
