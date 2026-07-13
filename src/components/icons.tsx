import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

// Standalone Icon component for dynamic icon rendering
export function Icon({ name, size = 24, className = "", style = {}, ...props }: IconProps & { name: keyof typeof Icons }) {
  const IconComponent = Icons[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} className={className} style={style} {...props} />;
}

function createIcon(paths: string[], viewBox = "0 0 24 24") {
  return function Icon({ size = 24, className = "", style = {}, ...props }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={{ ...style, flexShrink: 0 }}
        {...props}
      >
        {paths.map((d, i) => <path key={i} d={d} />)}
      </svg>
    );
  };
}

// ── Navigation & UI ──────────────────────────────────────────────────
export const ChevronLeft = createIcon([["M15 18l-6-6 6-6"]]);
export const ChevronRight = createIcon([["M9 18l6-6-6-6"]]);
export const ChevronUp = createIcon([["M18 15l-6-6-6 6"]]);
export const ChevronDown = createIcon([["M6 9l6 6 6-6"]]);

export const X = createIcon([["M18 6L6 18", "M6 6l12 12"]]);
export const XCircle = createIcon([["M22 2C13.7 2 7 8.7 7 17s6.7 15 15 15 15-6.7 15-15S30.3 2 22 2z", "M15 9l6 6", "M9 15l6-6"]]);

export const Home = createIcon([["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"]]);
export const Settings = createIcon([["M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z", "M12 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"]]);
export const Refresh = createIcon([["M23 4v6h-6", "M1 20v-6h6", "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"]]);
export const Menu = createIcon([["M3 12h18", "M3 6h18", "M3 18h18"]]);
export const MoreHorizontal = createIcon([["M21 12h-18", "M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z", "M3 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"]]);

// ── Game Icons ───────────────────────────────────────────────────────
export const Gamepad = createIcon([["M12 2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h6z", "M12 6v6", "M9 9h6", "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z", "M9 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"]]);
export const Users = createIcon([["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 11a4 4 0 0 0 0 8", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"]]);
export const UserPlus = createIcon([["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "M22 11a4 4 0 1 1-8 0 4 4 0 0 1 8 0z", "M22 16v6", "M19 19h-6"]]);
export const UserMinus = createIcon([["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "M22 11a4 4 0 1 1-8 0 4 4 0 0 1 8 0z", "M19 19H9"]]);
export const UserCheck = createIcon([["M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M22 11a4 4 0 1 1-8 0 4 4 0 0 1 8 0z", "m22 16-2 2 4 4", "m22 16 6-6"]]);
export const UserX = createIcon([["M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M22 11a4 4 0 1 1-8 0 4 4 0 0 1 8 0z", "M22 16l-6 6", "M16 16l6 6"]]);

export const Star = createIcon([["M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"]]);
export const Award = createIcon([["M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"]]);
export const Trophy = createIcon([["M6 9H4.5a2.5 2.5 0 0 1 0-5H15", "M18 9h1.5a2.5 2.5 0 0 0 0-5H9", "M4 22h16", "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.16 6 19.48 6 22h16c0-2.52-1.85-3.84-3.03-3.79-.5-.23-.97-.66-.97-1.21V14.66", "M18 2H6"]]);
export const Crown = createIcon([["M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"]]);

export const Target = createIcon([["M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z", "M12 20c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z", "M12 6c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z"]]);
export const Zap = createIcon([["M4 14a1 1 0 0 1-.78-1.63l9.9-10.27a.5.5 0 0 1 .86.03l9.8 10.27a1 1 0 0 1-.79 1.63H14.56l-2.25 2.74a1 1 0 0 1-.14.05H6.48a1 1 0 0 1-.9-.64L4 14z"]]);
export const Sparkles = createIcon([["M12 2l1 4", "M22 12l-4 1", "M12 22l-1-4", "M2 12l4-1", "M5 5l2 2", "M17 5l-2 2", "M5 19l2-2", "M17 19l-2-2"]]);

export const MessageCircle = createIcon([["M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"]]);
export const MessageSquare = createIcon([["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"]]);
export const Bell = createIcon([["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"]]);
export const BellOff = createIcon([["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0", "M10 8a6 6 0 0 1 12 0", "M6 8a6 6 0 0 0 12 0", "M22 2l-10 10"]]);

export const AlertTriangle = createIcon([["M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z", "M12 9v4", "M12 17h.01"]]);
export const Info = createIcon([["M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z", "M12 16v-4", "M12 8h.01"]]);

// ── Game Specific ────────────────────────────────────────────────────
export const Dice = createIcon([["M18 2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10z", "M10 10a2 2 0 1 1 4 0 2 2 0 0 1-4 0z", "M14 14a2 2 0 1 1 4 0 2 2 0 0 1-4 0z", "M6 6a2 2 0 1 1 4 0 2 2 0 0 1-4 0z", "M18 18a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"]]);
export const Check = createIcon([["M20 6L9 17l-5-5"]]);
export const CheckCircle = createIcon([["M22 11.08V12a10 10 0 1 1-5.93-9.14", "M22 4L12 14.01l-3-3"]]);
export const Circle = createIcon([["M22 12h-4", "M2 12h4", "M12 2v4", "M12 22v-4", "M12 12a10 10 0 0 0-10 10", "M22 12a10 10 0 0 1-10 10"]]);

export const Heart = createIcon([["M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"]]);
export const HeartHandshake = createIcon([["M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"]]);

export const Music = createIcon([["M9 18V5l12-2v13", "M9 9h12v6H9z"]]);
export const Volume2 = createIcon([["M11 4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4", "M15.54 8.46a5 5 0 0 1 0 7.07", "M19.07 4.93a10 10 0 0 1 0 14.14"]]);
export const VolumeX = createIcon([["M11 4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4", "M15.54 8.46a5 5 0 0 1 0 7.07", "M17 17l-5-5", "M12 12l5 5"]]);

export const Mic = createIcon([["M12 2a3 3 0 0 1 3 3v11a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z", "M19 10v2a7 7 0 0 1-14 0v-2", "M12 19v4"]]);
export const MicOff = createIcon([["M12 2a3 3 0 0 1 3 3v11a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z", "M19 10v2a7 7 0 0 1-14 0v-2", "M12 19v4", "M17 17l-5-5"]]);

export const Pen = createIcon([["M12 19l7-7 3 3-7 7-3-3z", "M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z", "M2 2l7.586 7.586", "M21 21l-7.586-7.586"]]);
export const Brush = createIcon([["M12 19l7-7 3 3-7 7-3-3z", "M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"]]);

export const Puzzle = createIcon([["M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4a2 2 0 0 0 0 4h4a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4h-4a2 2 0 0 0 0 4h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 1 0-4h4a2 2 0 0 0 0-4h-4"]]);

export const Shield = createIcon([["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"]]);
export const ShieldCheck = createIcon([["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", "M9 12l2 2 4-4"]]);

export const Sword = createIcon([["M18 6 3 21", "M6 18l12-12", "M15 3l5 5", "M21 9l-5 5"]]);
export const Crosshair = createIcon([["M22 12h-4", "M2 12h4", "M12 2v4", "M12 22v-4", "M12 12a10 10 0 0 0-10 10", "M22 12a10 10 0 0 1-10 10"]]);

export const Clock = createIcon([["M12 6v6l4 2"]]);
export const Timer = createIcon([["M10 2h4", "M4.5 11a7 7 0 0 0 1.5 2.5l3.5 3.5", "M15 2v4"]]);
export const Hourglass = createIcon([["M6 2v4", "M10 2v4", "M14 2v4", "M18 2v4", "M6 18v4", "M10 18v4", "M14 18v4", "M18 18v4", "M8 6h8", "M16 6v8", "M8 16h8", "M16 10v8"]]);

export const Calendar = createIcon([["M8 2v4", "M16 2v4", "M21 13V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6", "M3 10h18"]]);
export const CalendarDays = createIcon([["M8 2v4", "M16 2v4", "M21 13V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6", "M3 10h18", "M8 14h.01", "M12 14h.01", "M16 14h.01", "M8 18h.01", "M12 18h.01", "M16 18h.01"]]);

// ── Social & Communication ──────────────────────────────────────────
export const Share = createIcon([["M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8", "M16 6l-4-4-4 4", "M12 2v14.5"]]);
export const Share2 = createIcon([["M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8", "M16 6l-4-4-4 4", "M12 2v14.5"]]);
export const Download = createIcon([["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"]]);
export const Upload = createIcon([["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M17 8l-5-5-5 5", "M12 4v12"]]);
export const Link = createIcon([["M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71", "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"]]);
export const Link2 = createIcon([["M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3", "M6 12l6-6", "M18 12l-6 6"]]);

export const Wifi = createIcon([["M5 13a10 10 0 0 1 14 0", "M8.5 16.5a5 5 0 0 1 7 0", "M12 17v4", "M12 20h.01"]]);
export const WifiOff = createIcon([["M8.5 16.5a5 5 0 0 1 7 0", "M5 13a10 10 0 0 1 14 0", "M12 17v4", "M12 20h.01", "M2 2l20 20"]]);
export const Bluetooth = createIcon([["M7 7l10 10-5 5V2l5 5L7 17l10-10"]]);

// ── Camera & Media ──────────────────────────────────────────────────
export const Camera = createIcon([["M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z", "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"]]);
export const Image = createIcon([["M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z", "M17 5l-5 5 5 5", "M3 16l4-4 4 4"]]);
export const Video = createIcon([["M23 9l-7 7 7 7V5l-7 7 7 7v-14z", "M17 17l5 5 5-5"]]);
export const Film = createIcon([["M2 2h20a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z", "M2 10h20", "M2 14h20", "M10 2v20", "M14 2v20"]]);
export const Play = createIcon([["M5 3l14 9-14 9z"]]);
export const Pause = createIcon([["M6 4h4v16H6V4z", "M14 4h4v16h-4V4z"]]);
export const StopCircle = createIcon([["M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z", "M12 8v8", "M8 12h8"]]);

// ── Categories & Tags ────────────────────────────────────────────────
export const Tag = createIcon([["M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z", "M7 7a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"]]);
export const Tags = createIcon([["M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z", "M7 7a2 2 0 1 1 4 0 2 2 0 0 1-4 0z", "M15 5l-5 5 5 5-5-5"]]);
export const Bookmark = createIcon([["M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"]]);
export const Folder = createIcon([["M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-5"]]);
export const FolderOpen = createIcon([["M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-5", "M2 10v10a2 2 0 0 0 2 2h16"]]);

export const Package = createIcon([["M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z", "M3.3 7 12 12l8.7-5", "M12 22l-8.7-5", "M12 12l8.7 5"]]);
export const Box = createIcon([["M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z", "M3.3 7 12 12l8.7-5", "M12 22l-8.7-5", "M12 12l8.7 5"]]);

export const Grid = createIcon([["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"]]);
export const Layout = createIcon([["M3 3h18v18H3V3z", "M3 9h18", "M9 21V9"]]);
export const LayoutDashboard = createIcon([["M3 3h18v18H3V3z", "M3 9h18", "M9 21V9"]]);

// ── Food & Drink ─────────────────────────────────────────────────────
export const Coffee = createIcon([["M10 2v2", "M14 2v2", "M16 8a1 1 0 0 1 1 1v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V9a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v8a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H5", "M7 15h.01", "M11 15h.01", "M15 15h.01", "M19 15h.01"]]);
export const Pizza = createIcon([["M12 21a9 9 0 0 0 9-9c0-2.5-1.45-4.7-3.5-5.7L12 2", "M8 8.5c0 1.4.9 2.6 2.1 3.1L12 15l1.9-3.4c1.2-.5 2.1-1.7 2.1-3.1A6.5 6.5 0 1 0 8 8.5z", "M12 6.5v6", "M15 9.5a1.5 1.5 0 1 1-3 0"]]);
export const Cookie = createIcon([["M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z", "M12 8v8", "M8 12h8", "M16 12h.01", "M8 12h.01", "M16 8h.01", "M8 8h.01"]]);
export const Cake = createIcon([["M20 21v-7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7", "M4 16v7", "M20 16v7", "M4 8h16", "M12 12v8", "M12 4v4", "M8 12h8"]]);

export const Utensils = createIcon([["M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2", "M7 2v20", "M21 15V2a5 5 0 0 0-5-5v6c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"]]);
export const Wine = createIcon([["M8 22h8", "M12 11v11", "M7 10a2 2 0 0 0-2 2v10", "M17 10a2 2 0 0 1 2 2v10", "M9 10v5a7 7 0 0 0 14 0v-5"]]);
export const Beer = createIcon([["M1 4v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4", "M5 12v4", "M11 8v8", "M17 12v4"]]);

// ── Nature & Weather ────────────────────────────────────────────────
export const Sun = createIcon([["M12 2v2", "M12 20v2", "M4.93 4.93l1.41 1.41", "M17.66 17.66l1.41 1.41", "M2 12h2", "M20 12h2", "M4.93 19.07l1.41-1.41", "M17.66 6.34l1.41-1.41"]]);
export const Moon = createIcon([["M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"]]);
export const Cloud = createIcon([["M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"]]);
export const CloudRain = createIcon([["M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z", "M16 13v6", "M16 21h.01", "M12 13v6", "M12 21h.01", "M8 13v6", "M8 21h.01"]]);
export const CloudSnow = createIcon([["M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z", "M16 13v6", "M16 21h.01", "M12 13v6", "M12 21h.01", "M8 13v6", "M8 21h.01"]]);
export const CloudLightning = createIcon([["M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z", "M13 11l-2 6h4l-2 6"]]);
export const Wind = createIcon([["M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"]]);
export const Droplets = createIcon([["M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"]]);
export const Flame = createIcon([["M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"]]);

export const TreePine = createIcon([["M12 2v20", "M12 2v20", "M17 16l-5-8-5 8", "M17 10l-5-8-5 8", "M17 4l-5-2-5 2", "M12 22v-2"]]);
export const Flower = createIcon([["M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Z", "M12 6v4", "M12 14v4", "M6 12h4", "M14 12h4", "M18.5 3.5a5 5 0 1 1-7 7", "M3.5 18.5a5 5 0 1 1 7-7"]]);
export const Leaf = createIcon([["M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2.5 2 5.18 2 8.24C21 16.5 15.97 18 9.8 21.95A7 7 0 0 1 11 20Z", "M2 21c0-3 1.85-5.36 5.08-6C9.5 12.69 12 11.34 13 8c1-3.25-.5-6.66-3-8.69A7 7 0 0 0 2 3c0 4.35 2.43 8.13 6.16 9.69C10.5 14.5 11.26 16.86 10 20"]]);

// ── Sports & Activities ─────────────────────────────────────────────
export const Football = createIcon([["M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z", "M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z", "M22 12c0 5.5-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2z"]]);
export const Basketball = createIcon([["M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z", "M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"]]);
export const Tennis = createIcon([["M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z", "M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z", "M2 12h20"]]);
export const Dumbbell = createIcon([["M5 6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6Z", "M19 10v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V10", "M5 10v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10"]]);
export const Trophy2 = createIcon([["M6 9H4.5a2.5 2.5 0 0 1 0-5H15", "M18 9h1.5a2.5 2.5 0 0 0 0-5H9", "M4 22h16", "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.16 6 19.48 6 22h16c0-2.52-1.85-3.84-3.03-3.79-.5-.23-.97-.66-.97-1.21V14.66", "M18 2H6"]]);
export const Medal = createIcon([["M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z", "M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z", "M22 12c0 5.5-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2z"]]);

// ── Transport ────────────────────────────────────────────────────────
export const Car = createIcon([["M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 13.5 10h-7A5 5 0 0 0 6 15v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h2", "M7 17a2 2 0 1 1 4 0", "M17 17a2 2 0 1 1 4 0"]]);
export const Truck = createIcon([["M5 6v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6", "M5 6h14", "M9 6V2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4", "M15 10a2 2 0 0 1-4 0", "M17 16a2 2 0 1 1 4 0"]]);
export const Plane = createIcon([["M17.8 17.5a1.5 1.5 0 0 1 .4 1.1l1.6 6.1a.7.7 0 0 1-1.2.6L11.8 20.8l-7.4 3.7a.7.7 0 0 1-.6-.6L11 15.5l-5.5-2.3a.7.7 0 0 1-.2-1.3l10.5-7.7a.7.7 0 0 1 1.2.2l6.1 4.5a.7.7 0 0 1 .2 1.3z"]]);
export const Ship = createIcon([["M2 16a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4Z", "M18 16h2a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2", "M2 20h20", "M14 16v4", "M14 12a2 2 0 1 1 4 0"]]);
export const Bike = createIcon([["M12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z", "M12 7a12 12 0 0 0 0 24", "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z"]]);

// ── Technology ──────────────────────────────────────────────────────
export const Smartphone = createIcon([["M5 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H5Z", "M12 18h.01", "M12 6h.01"]]);
export const Laptop = createIcon([["M20 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6", "M4 14h16", "M12 18h.01"]]);
export const Monitor = createIcon([["M22 12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h20Z", "M8 16h8", "M12 12v8", "M12 4v4"]]);
export const Tablet = createIcon([["M4 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4Z", "M12 18h.01"]]);
export const Headphones = createIcon([["M3 18v-6a9 9 0 0 1 18 0v6", "M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3z"]]);
export const Keyboard = createIcon([["M8 4h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z", "M6 8h12", "M6 12h12", "M6 16h12"]]);
export const Mouse = createIcon([["M12 2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8Z", "M12 6v12"]]);
export const Cpu = createIcon([["M4 4h16", "M4 20h16", "M4 4v16", "M20 4v16", "M12 8v8", "M8 12h8"]]);
export const HardDrive = createIcon([["M2 12h20", "M17 5v14", "M7 5v14", "M2 5h20", "M2 19h20"]]);
export const Database = createIcon([["M4 4v16", "M20 4v16", "M4 4h16", "M20 20H4", "M4 12h16", "M4 8h16"]]);
export const Server = createIcon([["M6 2v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2", "M6 10h12", "M6 14h12", "M10 2v4", "M14 2v4"]]);
export const Wifi2 = createIcon([["M5 13a10 10 0 0 1 14 0", "M8.5 16.5a5 5 0 0 1 7 0", "M12 17v4", "M12 20h.01"]]);
export const Bluetooth2 = createIcon([["M7 7l10 10-5 5V2l5 5L7 17l10-10"]]);
export const Usb = createIcon([["M15 4h-2l-2 4h-2l2-4h-2l2 4h-2l-2-4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"]]);

// ── Finance & Shopping ──────────────────────────────────────────────
export const CreditCard = createIcon([["M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5Z", "M2 10h20", "M2 14h20"]]);
export const Wallet = createIcon([["M21 12V7H5a2 2 0 0 1 0-4h14v4", "M3 5v14a2 2 0 0 0 2 2h14"]]);
export const Banknote = createIcon([["M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z", "M12 8v8", "M8 12h8"]]);
export const Coins = createIcon([["M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z", "M12 8v8", "M8 12h8", "M18 14a4 4 0 1 1-8 0"]]);
export const Receipt = createIcon([["M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1-2 1V2l-2-1-2 1-2-1-2 1-2-1-2 1-2-1-2-1Z", "M12 6v12", "M12 10h.01", "M12 14h.01"]]);
export const ShoppingCart = createIcon([["M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z", "M3 6h18", "M16 10a4 4 0 0 1 0 8", "M12 18h.01"]]);
export const ShoppingBag = createIcon([["M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z", "M3 6h18", "M12 18h.01", "M9 6v12", "M15 6v12"]]);

// ── Health & Medical ────────────────────────────────────────────────
export const HeartPulse = createIcon([["M4 14a1 1 0 0 1-.78-1.63l9.9-10.27a.5.5 0 0 1 .86.03l9.8 10.27a1 1 0 0 1-.79 1.63H14.56l-2.25 2.74a1 1 0 0 1-.14.05H6.48a1 1 0 0 1-.9-.64L4 14z"]]);
export const Activity = createIcon([["M22 12h-4l-5 5 5 5", "M2 12l5-5-5-5", "M12 22l5-5-5-5", "M12 2l-5 5 5 5"]]);
export const Stethoscope = createIcon([["M12 2a2 2 0 0 0-2 2v2a2 2 0 0 1-4 0v4a2 2 0 0 0 4 0v2a2 2 0 0 1 4 0v4a2 2 0 0 0 2 2"]]);
export const Pill = createIcon([["M10.5 20.5a2.5 2.5 0 0 1-3-3L12 12l7.5-7.5a2.5 2.5 0 0 1 3 3L13.5 12l4.5 4.5a2.5 2.5 0 0 1-3 3z"]]);
export const Syringe = createIcon([["M14 14V5a2 2 0 0 0-2-2a2 2 0 0 0-2 2v9", "M8 16H6a5 5 0 0 1-5-5v-1a5 5 0 0 1 5-5h10a5 5 0 0 1 5 5v1a5 5 0 0 1-5 5h-2", "M16 14h4v4h-4z"]]);
export const Bandage = createIcon([["M12 22c3.3 0 6-2.7 6-6V4a4 4 0 0 0-4-4H4a4 4 0 0 0-4 4v12c0 3.3 2.7 6 6 6z", "M12 8v8", "M8 12h8"]]);

// ── Education & Science ─────────────────────────────────────────────
export const Book = createIcon([["M4 19.5A2.5 2.5 0 0 1 6.5 17H20", "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"]]);
export const BookOpen = createIcon([["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z", "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"]]);
export const GraduationCap = createIcon([["M21 21H3", "M12 2L3 7v14h18V7L12 2z", "M7 11l5 5 5-5", "M12 2v19"]]);
export const Beaker = createIcon([["M4.5 3h15", "M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3", "M6 14h12", "M8 6v8", "M16 6v8"]]);
export const FlaskConical = createIcon([["M10 2v7.31", "M14 2v7.31", "M8.5 16h7", "M7 16l1 10h10l1-10", "M9.5 6h5"]]);
export const Microscope = createIcon([["M12 2v8", "M9 10h6", "M7 16h10", "M12 14v8", "M9 18h6", "M12 22h.01"]]);
export const Telescope = createIcon([["M12 2v8", "M9 10h6", "M7 16h10", "M12 14v8", "M9 18h6", "M12 22h.01"]]);
export const Dna = createIcon([["M12 2v20", "M8 7h8", "M4 11h16", "M8 13h8", "M4 17h16", "M8 19h8"]]);

// ── Security & Auth ─────────────────────────────────────────────────
export const Lock = createIcon([["M18 8h1a4 4 0 0 1 0 8h-1", "M2 8h16v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8z"]]);
export const Unlock = createIcon([["M18 12H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2z", "M18 8h-1a4 4 0 0 0 0 8h1"]]);
export const Key = createIcon([["M18.5 2.5a3.5 3.5 0 1 1-3 3L7 19l-4 1 1-4L13.5 5.5a3.5 3.5 0 0 1 5 5z"]]);
export const Fingerprint = createIcon([["M12 3a7 7 0 0 0 7 7", "M16 17a5 5 0 0 1-10 0", "M9 9a3 3 0 0 1 6 0", "M12 6v6"]]);
export const Eye = createIcon([["M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z", "M12 18a6 6 0 0 1 0-12 6 6 0 0 1 0 12Z"]]);
export const EyeOff = createIcon([["M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z", "M12 18a6 6 0 0 1 0-12 6 6 0 0 1 0 12Z", "M17 12a4 4 0 0 1-8 0", "M22 2l-20 20"]]);
export const ShieldAlert = createIcon([["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", "M12 8v4", "M12 16h.01"]]);

// ── Settings & Tools ────────────────────────────────────────────────
export const Wrench = createIcon([["M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"]]);
export const Hammer = createIcon([["M15 4.5V16a2 2 0 0 1-2 2a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v2.5", "M9 14v4", "M15 4h2.5"]]);
export const Screwdriver = createIcon([["M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"]]);
export const Wrench2 = createIcon([["M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"]]);

// ── Weather & Environment ──────────────────────────────────────────
export const CloudDrizzle = createIcon([["M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z", "M16 13v6", "M16 21h.01", "M12 13v6", "M12 21h.01", "M8 13v6", "M8 21h.01"]]);
export const CloudFog = createIcon([["M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z", "M16 13v6", "M16 21h.01", "M12 13v6", "M12 21h.01", "M8 13v6", "M8 21h.01"]]);
export const CloudHail = createIcon([["M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z", "M16 13v6", "M16 21h.01", "M12 13v6", "M12 21h.01", "M8 13v6", "M8 21h.01"]]);
export const CloudLightning2 = createIcon([["M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z", "M13 11l-2 6h4l-2 6"]]);
export const CloudMoon = createIcon([["M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z", "M12 2a6 6 0 0 1 9 9"]]);
export const CloudSun = createIcon([["M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z", "M12 2v2", "M12 20v2", "M4.93 4.93l1.41 1.41", "M17.66 17.66l1.41 1.41", "M2 12h2", "M20 12h2", "M4.93 19.07l1.41-1.41", "M17.66 6.34l1.41-1.41"]]);
export const Tornado = createIcon([["M21 4H3", "M18 8H6", "M19 12H5", "M16 16H8", "M17 20H7"]]);
export const Wind2 = createIcon([["M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"]]);

// ── Arrows & Navigation ────────────────────────────────────────────
export const ArrowUp = createIcon([["M18 15l-6-6-6 6"]]);
export const ArrowDown = createIcon([["M6 9l6 6 6-6"]]);
export const ArrowLeft = createIcon([["M15 18l-6-6 6-6"]]);
export const ArrowRight = createIcon([["M9 18l6-6-6-6"]]);
export const ArrowUpRight = createIcon([["M7 17l10-10", "M7 7h10v10"]]);
export const ArrowDownLeft = createIcon([["M17 7l-10 10", "M17 17H7V7"]]);
export const ArrowUpLeft = createIcon([["M17 17l-10-10", "M17 7H7v10"]]);
export const ArrowDownRight = createIcon([["M7 7l10 10", "M17 7H7v10"]]);
export const ArrowUpFromLine = createIcon([["M12 19V5", "M5 12l7-7 7 7"]]);
export const ArrowDownToLine = createIcon([["M12 5v14", "M19 12l-7 7-7-7"]]);
export const ArrowLeftFromLine = createIcon([["M19 12H5", "M12 19l-7-7 7-7"]]);
export const ArrowRightToLine = createIcon([["M5 12h14", "M12 5l7 7-7 7"]]);

// ── Misc ────────────────────────────────────────────────────────────
export const CircleCheck = createIcon([["M22 11.08V12a10 10 0 1 1-5.93-9.14", "M22 4L12 14.01l-3-3"]]);
export const CircleX = createIcon([["M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z", "M15 9l-6 6", "M9 9l6 6"]]);
export const CirclePlus = createIcon([["M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z", "M12 8v8", "M8 12h8"]]);
export const CircleMinus = createIcon([["M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z", "M8 12h8"]]);
export const CircleArrowUp = createIcon([["M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z", "M12 18v-6", "M9 15l3-3 3 3"]]);
export const CircleArrowDown = createIcon([["M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z", "M12 6v6", "M9 9l3 3 3-3"]]);
export const CircleArrowLeft = createIcon([["M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z", "M18 12H6", "M10 15l-3-3 3-3"]]);
export const CircleArrowRight = createIcon([["M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z", "M6 12h12", "M14 15l3-3-3-3"]]);

export const Square = createIcon([["M3 3h18a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"]]);
export const RectangleHorizontal = createIcon([["M3 3h18a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"]]);
export const RectangleVertical = createIcon([["M3 3h18a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"]]);
export const Triangle = createIcon([["M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"]]);
export const Diamond = createIcon([["M12 2l9 9-9 9-9-9 9-9z"]]);
export const Hexagon = createIcon([["M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"]]);
export const Octagon = createIcon([["M2.05 4.05a2 2 0 0 1 1.42-0.58h16.06a2 2 0 0 1 1.42.58l4.95 4.95a2 2 0 0 1 .58 1.42v16.06a2 2 0 0 1-.58 1.42l-4.95 4.95a2 2 0 0 1-1.42.58H3.48a2 2 0 0 1-1.42-.58L.58 17.9a2 2 0 0 1-.58-1.42V3.48a2 2 0 0 1 .58-1.42z"]]);

// ── Colors & Palette ────────────────────────────────────────────────
export const Palette = createIcon([["M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Z", "M12 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z", "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z"]]);
export const Paintbrush = createIcon([["M4 21l4-4", "M4 17l8-8", "M20 7l-4-4", "M12 3l-4 4", "M12 15l4-4", "M12 11l4-4"]]);
export const PaintBucket = createIcon([["M19 11a7 7 0 0 1-7 7m0 0a16.8 16.8 0 0 1-5.2-1.1", "M5 5a17 17 0 0 1 17 17", "M2 16a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-8a3 3 0 0 0-3-3h-1v4a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h1"]]);
export const Droplet = createIcon([["M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"]]);
export const History = createIcon([["M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", "M3 3v5h5", "M12 7v5l4 2"]]);
export const RotateCcw = createIcon([["M1 4v6h6", "M3.51 15a9 9 0 1 0 2.13-9.36L1 10"]]);
export const Brain = createIcon([["M12 2a4 4 0 0 0-4 4c0 1.1.45 2.1 1.17 2.83A4 4 0 0 0 8 15c0 .89.34 1.7.9 2.3A3 3 0 0 0 9 20h6a3 3 0 0 0 .1-2.7 3.3 3.3 0 0 0 .9-2.3 4 4 0 0 0-1.17-2.83A4 4 0 0 0 16 6a4 4 0 0 0-4-4z", "M12 18v3"]]);
export const Smile = createIcon([["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M8 14s1.5 2 4 2 4-2 4-2", "M9 9h.01", "M15 9h.01"]]);
export const User = createIcon([["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"]]);
export const HelpCircle = createIcon([["M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", "M12 17h.01"], ["M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z"]]);
export const TouchApp = createIcon([["M9 11V6a2 2 0 0 1 4 0v5", "M9 11V8a2 2 0 0 1 4 0v3", "M9 11h6.5a3 3 0 0 1 3 3v3a4 4 0 0 1-4 4H10c-2 0-3-1-4-3l-3-5a2 2 0 0 1 4-1l1 1"]]);
export const Dice1 = createIcon([["M3 3h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z", "M12 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"]]);
export const Mask = createIcon([["M3 5a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3 3 3 0 0 1-3 3h-5l-1 2-1-2H6a3 3 0 0 1-3-3z", "M9 5h6"]]);

// ── Export all ───────────────────────────────────────────────────────
export const Icons = {
  // Navigation
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronUp: ChevronUp,
  chevronDown: ChevronDown,
  x: X,
  xCircle: XCircle,
  home: Home,
  settings: Settings,
  refresh: Refresh,
  menu: Menu,
  moreHorizontal: MoreHorizontal,
  
  // Game
  gamepad: Gamepad,
  users: Users,
  userPlus: UserPlus,
  userMinus: UserMinus,
  userCheck: UserCheck,
  userX: UserX,
  star: Star,
  award: Award,
  trophy: Trophy,
  crown: Crown,
  target: Target,
  zap: Zap,
  sparkles: Sparkles,
  
  // Communication
  messageCircle: MessageCircle,
  messageSquare: MessageSquare,
  bell: Bell,
  bellOff: BellOff,
  alertTriangle: AlertTriangle,
  info: Info,
  share: Share,
  share2: Share2,
  download: Download,
  upload: Upload,
  link: Link,
  link2: Link2,
  wifi: Wifi,
  wifiOff: WifiOff,
  bluetooth: Bluetooth,
  
  // Media
  camera: Camera,
  image: Image,
  video: Video,
  film: Film,
  play: Play,
  pause: Pause,
  stopCircle: StopCircle,
  
  // Categories
  tag: Tag,
  tags: Tags,
  bookmark: Bookmark,
  folder: Folder,
  folderOpen: FolderOpen,
  package: Package,
  box: Box,
  grid: Grid,
  layout: Layout,
  layoutDashboard: LayoutDashboard,
  
  // Food
  coffee: Coffee,
  pizza: Pizza,
  cookie: Cookie,
  cake: Cake,
  utensils: Utensils,
  wine: Wine,
  beer: Beer,
  
  // Nature
  sun: Sun,
  moon: Moon,
  cloud: Cloud,
  cloudRain: CloudRain,
  cloudSnow: CloudSnow,
  cloudLightning: CloudLightning,
  wind: Wind,
  droplets: Droplets,
  flame: Flame,
  treePine: TreePine,
  flower: Flower,
  leaf: Leaf,
  
  // Sports
  football: Football,
  basketball: Basketball,
  tennis: Tennis,
  dumbbell: Dumbbell,
  trophy2: Trophy2,
  medal: Medal,
  
  // Transport
  car: Car,
  truck: Truck,
  plane: Plane,
  ship: Ship,
  bike: Bike,
  
  // Technology
  smartphone: Smartphone,
  laptop: Laptop,
  monitor: Monitor,
  tablet: Tablet,
  headphones: Headphones,
  keyboard: Keyboard,
  mouse: Mouse,
  cpu: Cpu,
  hardDrive: HardDrive,
  database: Database,
  server: Server,
  wifi2: Wifi2,
  bluetooth2: Bluetooth2,
  usb: Usb,
  
  // Finance
  creditCard: CreditCard,
  wallet: Wallet,
  banknote: Banknote,
  coins: Coins,
  receipt: Receipt,
  shoppingCart: ShoppingCart,
  shoppingBag: ShoppingBag,
  
  // Health
  heartPulse: HeartPulse,
  activity: Activity,
  stethoscope: Stethoscope,
  pill: Pill,
  syringe: Syringe,
  bandage: Bandage,
  
  // Education
  book: Book,
  bookOpen: BookOpen,
  graduationCap: GraduationCap,
  beaker: Beaker,
  flaskConical: FlaskConical,
  microscope: Microscope,
  telescope: Telescope,
  dna: Dna,
  
  // Security
  lock: Lock,
  unlock: Unlock,
  key: Key,
  fingerprint: Fingerprint,
  eye: Eye,
  eyeOff: EyeOff,
  shieldAlert: ShieldAlert,
  
  // Tools
  wrench: Wrench,
  hammer: Hammer,
  screwdriver: Screwdriver,
  wrench2: Wrench2,
  
  // Weather
  cloudDrizzle: CloudDrizzle,
  cloudFog: CloudFog,
  cloudHail: CloudHail,
  cloudLightning2: CloudLightning2,
  cloudMoon: CloudMoon,
  cloudSun: CloudSun,
  tornado: Tornado,
  wind2: Wind2,
  
  // Arrows
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  arrowUpRight: ArrowUpRight,
  arrowDownLeft: ArrowDownLeft,
  arrowUpLeft: ArrowUpLeft,
  arrowDownRight: ArrowDownRight,
  arrowUpFromLine: ArrowUpFromLine,
  arrowDownToLine: ArrowDownToLine,
  arrowLeftFromLine: ArrowLeftFromLine,
  arrowRightToLine: ArrowRightToLine,
  
  // Misc
  circleCheck: CircleCheck,
  circleX: CircleX,
  circlePlus: CirclePlus,
  circleMinus: CircleMinus,
  circleArrowUp: CircleArrowUp,
  circleArrowDown: CircleArrowDown,
  circleArrowLeft: CircleArrowLeft,
  circleArrowRight: CircleArrowRight,
  square: Square,
  rectangleHorizontal: RectangleHorizontal,
  rectangleVertical: RectangleVertical,
  triangle: Triangle,
  diamond: Diamond,
  hexagon: Hexagon,
  octagon: Octagon,
  
  // Colors
  palette: Palette,
  paintbrush: Paintbrush,
  paintBucket: PaintBucket,
  droplet: Droplet,

  // Added for Home
  history: History,
  rotateCcw: RotateCcw,
  brain: Brain,
  user: User,
  smile: Smile,
  helpCircle: HelpCircle,
  touchApp: TouchApp,
  dice1: Dice1,
  dice: Dice,
  mask: Mask,
  sword: Sword,
  timer: Timer,
  clock: Clock,
  hourglass: Hourglass,
  calendar: Calendar,
} as const;