import type { CSSProperties } from "react";

// ── Design Tokens ─────────────────────────────────────────────────────

export const colors = {
  // Background
  bg: {
    primary: "#080b10",
    secondary: "#0d1219",
    tertiary: "#141a22",
    card: "rgba(20,26,34,0.9)",
    cardHover: "rgba(27,34,44,0.94)",
    cardActive: "rgba(33,41,52,0.96)",
  },
  
  // Brand gradients
  gradient: {
    primary: "linear-gradient(135deg, var(--game-accent, #8b5cf6), color-mix(in srgb, var(--game-accent, #8b5cf6) 72%, #263244))",
    primaryHover: "linear-gradient(135deg, color-mix(in srgb, var(--game-accent, #8b5cf6) 88%, white), var(--game-accent, #8b5cf6))",
    secondary: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
    success: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    danger: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    warning: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    purple: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
    cyan: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
    green: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    red: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    orange: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
  },
  
  // Semantic colors
  semantic: {
    success: "#22c55e",
    successLight: "rgba(34, 197, 94, 0.15)",
    successBorder: "rgba(34, 197, 94, 0.4)",
    danger: "#ef4444",
    dangerLight: "rgba(239, 68, 68, 0.15)",
    dangerBorder: "rgba(239, 68, 68, 0.4)",
    warning: "#f59e0b",
    warningLight: "rgba(245, 158, 11, 0.15)",
    warningBorder: "rgba(245, 158, 11, 0.4)",
    info: "#06b6d4",
    infoLight: "rgba(6, 182, 212, 0.15)",
    infoBorder: "rgba(6, 182, 212, 0.4)",
    purple: "#a855f7",
    purpleLight: "rgba(168, 85, 247, 0.15)",
    purpleBorder: "rgba(168, 85, 247, 0.4)",
  },
  
  // Text
  text: {
    primary: "#ffffff",
    secondary: "rgba(255,255,255,0.7)",
    muted: "rgba(255,255,255,0.5)",
    disabled: "rgba(255,255,255,0.3)",
    inverse: "#080b10",
  },
  
  // Borders
  border: {
    light: "rgba(255,255,255,0.08)",
    medium: "rgba(255,255,255,0.15)",
    strong: "rgba(255,255,255,0.25)",
    focus: "var(--game-accent, #8b5cf6)",
  },
  
  // Team colors
  team: {
    a: { main: "#3b82f6", light: "rgba(59, 130, 246, 0.15)", border: "rgba(59, 130, 246, 0.4)", dark: "#1d4ed8" },
    b: { main: "#ef4444", light: "rgba(239, 68, 68, 0.15)", border: "rgba(239, 68, 68, 0.4)", dark: "#dc2626" },
  },
  
  // Difficulty
  difficulty: {
    easy: { main: "#22c55e", light: "rgba(34, 197, 94, 0.15)", border: "rgba(34, 197, 94, 0.4)" },
    medium: { main: "#f59e0b", light: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.4)" },
    hard: { main: "#ef4444", light: "rgba(239, 68, 68, 0.15)", border: "rgba(239, 68, 68, 0.4)" },
  },
} as const;

export const spacing = {
  xs: "0.25rem",    // 4px
  sm: "0.5rem",     // 8px
  md: "1rem",       // 16px
  lg: "1.5rem",     // 24px
  xl: "2rem",       // 32px
  "2xl": "3rem",    // 48px
  "3xl": "4rem",    // 64px
} as const;

export const borderRadius = {
  sm: "0.5rem",     // 8px
  md: "0.75rem",    // 12px
  lg: "1rem",       // 16px
  xl: "1.25rem",    // 20px
  "2xl": "1.625rem", // 26px
  full: "9999px",
} as const;

export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  glow: "0 0 20px rgba(168, 85, 247, 0.3)",
  glowStrong: "0 0 40px rgba(168, 85, 247, 0.5)",
  glowSuccess: "0 0 20px rgba(34, 197, 94, 0.3)",
  glowDanger: "0 0 20px rgba(239, 68, 68, 0.3)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)",
} as const;

export const transitions = {
  fast: "150ms ease-out",
  normal: "250ms ease-out",
  slow: "350ms ease-out",
  spring: "400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
  bounce: "300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)",
} as const;

export const typography = {
  fontFamily: {
    sans: '"Inter", system-ui, sans-serif',
    display: '"Manrope", "Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
  },
  fontSize: {
    xs: "0.75rem",      // 12px
    sm: "0.875rem",     // 14px
    base: "1rem",       // 16px
    lg: "1.125rem",     // 18px
    xl: "1.25rem",      // 20px
    "2xl": "1.5rem",    // 24px
    "3xl": "1.875rem",  // 30px
    "4xl": "2.25rem",   // 36px
    "5xl": "3rem",      // 48px
    "6xl": "3.75rem",   // 60px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  lineHeight: {
    tight: 1.1,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
} as const;

export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  toast: 800,
  max: 9999,
} as const;

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// ── Animation Helpers ────────────────────────────────────────────────

export const keyframes = {
  // Fade
  fadeIn: {
    "0%": { opacity: 0 },
    "100%": { opacity: 1 },
  },
  fadeOut: {
    "0%": { opacity: 1 },
    "100%": { opacity: 0 },
  },
  
  // Slide
  slideInFromTop: {
    "0%": { transform: "translateY(-100%)", opacity: 0 },
    "100%": { transform: "translateY(0)", opacity: 1 },
  },
  slideInFromBottom: {
    "0%": { transform: "translateY(100%)", opacity: 0 },
    "100%": { transform: "translateY(0)", opacity: 1 },
  },
  slideInFromLeft: {
    "0%": { transform: "translateX(-100%)", opacity: 0 },
    "100%": { transform: "translateX(0)", opacity: 1 },
  },
  slideInFromRight: {
    "0%": { transform: "translateX(100%)", opacity: 0 },
    "100%": { transform: "translateX(0)", opacity: 1 },
  },
  
  // Scale
  scaleIn: {
    "0%": { transform: "scale(0.9)", opacity: 0 },
    "100%": { transform: "scale(1)", opacity: 1 },
  },
  scaleOut: {
    "0%": { transform: "scale(1)", opacity: 1 },
    "100%": { transform: "scale(0.9)", opacity: 0 },
  },
  popIn: {
    "0%": { transform: "scale(0.5)", opacity: 0 },
    "50%": { transform: "scale(1.05)" },
    "100%": { transform: "scale(1)", opacity: 1 },
  },
  
  // Rotate
  spin: {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
  ping: {
    "0%": { transform: "scale(1)", opacity: 1 },
    "75%": { transform: "scale(1.5)", opacity: 0 },
    "100%": { transform: "scale(1)", opacity: 0 },
  },
  pulse: {
    "0%, 100%": { opacity: 1 },
    "50%": { opacity: 0.5 },
  },
  bounce: {
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-10px)" },
  },
  
  // Shake
  shake: {
    "0%, 100%": { transform: "translateX(0)" },
    "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-4px)" },
    "20%, 40%, 60%, 80%": { transform: "translateX(4px)" },
  },
  
  // Flash
  flash: {
    "0%, 100%": { opacity: 1 },
    "50%": { opacity: 0 },
  },
  
  // Confetti
  confettiFall: {
    "0%": { transform: "translateY(-20px) rotate(0deg)", opacity: 1 },
    "100%": { transform: "translateY(110vh) rotate(720deg)", opacity: 0 },
  },
  
  // Progress
  progressFill: {
    "0%": { width: "0%" },
    "100%": { width: "var(--progress-width)" },
  },
} as const;

// Create CSS-in-JS style objects for animations
export function createAnimation(
  name: keyof typeof keyframes,
  duration: string = "normal",
  easing: string = "ease-out",
  fill: "forwards" | "backwards" | "both" | "none" = "forwards"
): CSSProperties {
  return {
    animationName: name,
    animationDuration: transitions[duration as keyof typeof transitions] || duration,
    animationTimingFunction: easing,
    animationFillMode: fill,
  };
}

// Staggered animation delays
export function staggerDelay(index: number, baseDelay: number = 50): string {
  return `${index * baseDelay}ms`;
}

// ── Component Style Presets ──────────────────────────────────────────

export const componentStyles = {
  // Card variants
  card: {
    base: {
      borderRadius: borderRadius.lg,
      background: colors.bg.card,
      border: `1px solid ${colors.border.light}`,
      backdropFilter: "blur(10px)",
    },
    elevated: {
      borderRadius: borderRadius.lg,
      background: colors.bg.card,
      border: `1px solid ${colors.border.medium}`,
      boxShadow: shadows.lg,
      backdropFilter: "blur(20px)",
    },
    outlined: {
      borderRadius: borderRadius.lg,
      background: "transparent",
      border: `1px solid ${colors.border.medium}`,
    },
    gradient: {
      borderRadius: borderRadius.lg,
      border: "1px solid transparent",
      background: "linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.05)) padding-box, linear-gradient(135deg, #a855f7, #ec4899) border-box",
    },
  },
  
  // Button variants
  button: {
    base: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      borderRadius: borderRadius.xl,
      padding: `${spacing.sm} ${spacing.lg}`,
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.bold,
      fontFamily: typography.fontFamily.sans,
      transition: transitions.normal,
      cursor: "pointer",
      border: "none",
      outline: "none",
      textDecoration: "none",
    },
    primary: {
      background: colors.gradient.primary,
      color: colors.text.primary,
      boxShadow: "0 4px 14px 0 rgba(168, 85, 247, 0.4)",
    },
    primaryHover: {
      background: colors.gradient.primaryHover,
      boxShadow: "0 6px 20px 0 rgba(168, 85, 247, 0.5)",
      transform: "scale(1.02)",
    },
    primaryActive: {
      transform: "scale(0.98)",
    },
    secondary: {
      background: colors.bg.card,
      color: colors.text.primary,
      border: `1px solid ${colors.border.medium}`,
    },
    secondaryHover: {
      background: colors.bg.cardHover,
      borderColor: colors.border.strong,
    },
    ghost: {
      background: "transparent",
      color: colors.text.secondary,
    },
    ghostHover: {
      background: colors.bg.card,
      color: colors.text.primary,
    },
    danger: {
      background: colors.gradient.danger,
      color: colors.text.primary,
      boxShadow: "0 4px 14px 0 rgba(239, 68, 68, 0.4)",
    },
    dangerHover: {
      boxShadow: "0 6px 20px 0 rgba(239, 68, 68, 0.5)",
      transform: "scale(1.02)",
    },
    disabled: {
      opacity: 0.4,
      cursor: "not-allowed",
    },
  },
  
  // Input variants
  input: {
    base: {
      width: "100%",
      borderRadius: borderRadius.xl,
      padding: `${spacing.sm} ${spacing.md}`,
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      fontFamily: typography.fontFamily.sans,
      color: colors.text.primary,
      background: colors.bg.card,
      border: `1px solid ${colors.border.light}`,
      outline: "none",
      transition: transitions.fast,
    },
    focus: {
      borderColor: colors.border.focus,
      boxShadow: `0 0 0 3px ${colors.semantic.purpleLight}`,
    },
    error: {
      borderColor: colors.semantic.dangerBorder,
    },
    disabled: {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
  
  // Badge/Chip variants
  badge: {
    base: {
      display: "inline-flex",
      alignItems: "center",
      gap: spacing.xs,
      borderRadius: borderRadius.full,
      padding: `${spacing.xs} ${spacing.md}`,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
      fontFamily: typography.fontFamily.sans,
      transition: transitions.fast,
      cursor: "pointer",
      border: "none",
      background: "transparent",
    },
    active: {
      background: colors.gradient.primary,
      color: colors.text.primary,
      boxShadow: "0 4px 14px 0 rgba(168, 85, 247, 0.4)",
    },
    inactive: {
      background: colors.bg.card,
      color: colors.text.muted,
      border: `1px solid ${colors.border.light}`,
    },
    inactiveHover: {
      background: colors.bg.cardHover,
      color: colors.text.secondary,
    },
  },
  
  // Toggle switch
  toggle: {
    track: {
      width: "3rem",
      height: "1.75rem",
      borderRadius: borderRadius.full,
      background: colors.border.light,
      transition: transitions.normal,
      position: "relative" as const,
    },
    trackActive: {
      background: colors.gradient.primary,
    },
    thumb: {
      width: "1.25rem",
      height: "1.25rem",
      borderRadius: borderRadius.full,
      background: colors.text.primary,
      boxShadow: shadows.md,
      transition: transitions.spring,
      position: "absolute" as const,
      top: "0.25rem",
      left: "0.25rem",
    },
    thumbActive: {
      left: "1.5rem",
    },
  },
  
  // Stepper
  stepper: {
    container: {
      display: "flex",
      alignItems: "center",
      gap: spacing.md,
    },
    button: {
      width: "2.5rem",
      height: "2.5rem",
      borderRadius: borderRadius.lg,
      background: colors.bg.card,
      border: `1px solid ${colors.border.light}`,
      color: colors.text.primary,
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      cursor: "pointer",
      transition: transitions.fast,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    buttonDisabled: {
      opacity: 0.3,
      cursor: "not-allowed",
    },
    value: {
      width: "2.5rem",
      textAlign: "center",
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.extrabold,
      fontFamily: typography.fontFamily.display,
      color: colors.text.primary,
    },
  },
  
  // TopBar
  topBar: {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "2.75rem",
      marginBottom: spacing.md,
    },
    backButton: {
      width: "2.5rem",
      height: "2.5rem",
      borderRadius: borderRadius.full,
      background: colors.bg.card,
      border: `1px solid ${colors.border.light}`,
      color: colors.text.primary,
      fontSize: typography.fontSize.lg,
      cursor: "pointer",
      transition: transitions.fast,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      color: colors.text.muted,
      fontFamily: typography.fontFamily.sans,
    },
  },
  
  // Shell
  shell: {
    container: {
      position: "relative",
      minHeight: "100vh",
      width: "100%",
      color: colors.text.primary,
    },
    content: {
      maxWidth: "28rem",
      margin: "0 auto",
      padding: `${spacing.xl} ${spacing.md} ${spacing["2xl"]} ${spacing.md}`,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    },
  },
  
  // Background gradient blobs
  background: {
    container: {
      position: "fixed",
      inset: 0,
      zIndex: -10,
      overflow: "hidden",
      background: colors.bg.primary,
    },
    blob: {
      position: "absolute",
      borderRadius: "50%",
      filter: "blur(100px)",
      opacity: 0.3,
    },
    pattern: {
      position: "absolute",
      inset: 0,
      opacity: 0.15,
      backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
      backgroundSize: "26px 26px",
    },
  },
} as const;

// ── Utility Functions ────────────────────────────────────────────────

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getRandomColor(): string {
  const hues = [0, 30, 60, 120, 180, 210, 270, 300, 330];
  const hue = hues[Math.floor(Math.random() * hues.length)];
  return `hsl(${hue}, 70%, 55%)`;
}

// Responsive value helper
export function responsive<T>(values: { base: T; sm?: T; md?: T; lg?: T; xl?: T }): T {
  // This is a placeholder - in practice would use CSS media queries
  return values.base;
}

export const designTokens = {
  colors,
  spacing,
  borderRadius,
  shadows,
  transitions,
  typography,
  zIndex,
  breakpoints,
  keyframes,
  componentStyles,
  cn,
  hexToRgba,
  getRandomColor,
  responsive,
  createAnimation,
  staggerDelay,
} as const;
