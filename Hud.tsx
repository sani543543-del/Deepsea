import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, toBn } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Counter with Bengali digits; final width is reserved so the layout never jitters.
export const Counter: React.FC<{ to: number; delay?: number; suffix?: string; style?: React.CSSProperties }> = ({ to, delay = 0, suffix = "", style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 30, stiffness: 60, mass: 1 } });
  const v = Math.min(to, interpolate(p, [0, 1], [0, to]));
  const shown = toBn(v) + suffix;
  return (
    <span style={{ position: "relative", display: "inline-block", ...style }}>
      <span style={{ visibility: "hidden" }}>{toBn(to) + suffix}</span>
      <span style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap" }}>{shown}</span>
    </span>
  );
};

// Vertical depth gauge with a descending marker.
export const DepthGauge: React.FC<{ x: number; y: number; height: number; delay: number }> = ({ x, y, height, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ticks = 12;
  const prog = spring({ frame: frame - delay - 6, fps, config: { damping: 26, stiffness: 50, mass: 1 } });
  const lineP = spring({ frame: frame - delay, fps, config: theme.spring.smooth });
  const markerY = Math.min(1, prog) * height;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 120, height }}>
      <svg width={120} height={height + 20} style={{ overflow: "visible" }}>
        <line x1={60} y1={0} x2={60} y2={height * Math.min(1, lineP)} stroke={theme.colors.textDim} strokeOpacity={0.5} strokeWidth={2} />
        {Array.from({ length: ticks }).map((_, i) => {
          const tp = spring({ frame: frame - delay - i * 3, fps, config: theme.spring.snappy });
          const ty = (i / (ticks - 1)) * height;
          const len = (i % 5 === 0 || i === ticks - 1 ? 34 : 18) * Math.min(1, tp);
          return <line key={i} x1={60 - len / 2} y1={ty} x2={60 + len / 2} y2={ty} stroke={theme.colors.textDim} strokeOpacity={0.7} strokeWidth={2} strokeLinecap="round" />;
        })}
        <circle cx={60} cy={markerY} r={16} fill={theme.colors.eye} style={{ filter: `drop-shadow(0 0 14px ${theme.colors.glowSoft})` }} />
        <circle cx={60} cy={markerY} r={26 + Math.sin(frame / 8) * 3} fill="none" stroke={theme.colors.eye} strokeOpacity={0.35} strokeWidth={2} />
      </svg>
    </div>
  );
};

// Sea-floor cross-section with a trench; the line draws itself in.
export const TrenchProfile: React.FC<{ delay: number; top: number }> = ({ delay, top }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const draw = spring({ frame: frame - delay, fps, config: { damping: 24, stiffness: 55, mass: 1 } });
  const d = "M0 70 C300 68, 520 82, 700 105 S 860 170, 905 260 L 960 300 L 1015 260 C 1060 170, 1160 105, 1300 85 S 1700 68, 1920 70";
  return (
    <div style={{ position: "absolute", left: 0, top, width, height: 320, opacity: Math.min(1, draw) }}>
      <svg width={width} height={320} viewBox="0 0 1920 320">
        <defs>
          <linearGradient id="trenchFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme.colors.accent} stopOpacity="0.22" />
            <stop offset="100%" stopColor={theme.colors.bg} stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <path d={`${d} L1920 320 L0 320 Z`} fill="url(#trenchFill)" opacity={Math.min(1, draw)} />
        <path d={d} pathLength={1} fill="none" stroke={theme.colors.eye} strokeWidth={4} strokeLinecap="round"
          strokeDasharray={1} strokeDashoffset={1 - Math.min(1, draw)} style={{ filter: `drop-shadow(0 0 12px ${theme.colors.glowSoft})` }} />
      </svg>
    </div>
  );
};

// Concentric rings converging inward = pressure closing in.
export const PressureRings: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const n = 5;
  const period = fps * 2.4;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={width} height={height}>
        {Array.from({ length: n }).map((_, i) => {
          const ph = (((frame - delay) / period) + i / n) % 1;
          const r = interpolate(ph, [0, 1], [720, 170], { easing: theme.ease.inOut, ...clamp });
          const o = interpolate(ph, [0, 0.2, 0.85, 1], [0, 0.55, 0.55, 0], clamp) * (frame >= delay ? 1 : 0);
          return <ellipse key={i} cx={width / 2} cy={height / 2} rx={r * 1.25} ry={r * 0.78} fill="none" stroke={theme.colors.accent} strokeWidth={3} opacity={o}
            style={{ filter: `drop-shadow(0 0 10px ${theme.colors.glowSoft})` }} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};
