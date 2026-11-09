import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const rand = (n: number) => { const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };

// Marine snow + tiny bioluminescent specks (assets layer).
export const Particles: React.FC<{ count?: number; seed?: number }> = ({ count = 60, seed = 1 }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const fadeIn = interpolate(frame, [0, fps * 0.8], [0, 1], { easing: theme.ease.out, ...clamp });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: fadeIn }}>
      {Array.from({ length: count }).map((_, i) => {
        const r1 = rand(seed * 100 + i * 5 + 1), r2 = rand(seed * 100 + i * 5 + 2), r3 = rand(seed * 100 + i * 5 + 3), r4 = rand(seed * 100 + i * 5 + 4);
        const size = 2 + r3 * 5;
        const y = ((r2 * height + t * (10 + r4 * 26)) % (height + 60)) - 30;
        const x = r1 * width + Math.sin(t * 0.6 + r2 * 6.28) * 26;
        const twinkle = 0.5 + 0.5 * Math.sin(t * 1.4 + r4 * 6.28);
        const glow = r3 > 0.62;
        return (
          <div key={i} style={{
            position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%",
            background: glow ? theme.colors.eye : "rgba(200,235,255,0.55)",
            opacity: 0.12 + 0.5 * twinkle * (glow ? 1 : 0.6),
            boxShadow: glow ? `0 0 ${size * 4}px ${theme.colors.glowSoft}` : "none",
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// Drawn-in-SVG jellyfish. `lit` (0..1) controls how strongly it glows.
export const Jelly: React.FC<{
  x: number; y: number; size: number; delay?: number; phase?: number; color?: string; rise?: number; lit?: number;
}> = ({ x, y, size, delay = 0, phase = 0, color = theme.colors.accent, rise = 60, lit = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const id = React.useId().replace(/:/g, "");
  const p = spring({ frame: frame - delay, fps, config: theme.spring.smooth });
  const pulse = Math.sin(t * 2.2 + phase);
  const drift = interpolate(frame, [0, fps * 8], [0, -rise], { easing: theme.ease.inOut, ...clamp });
  const float = Math.sin(t * 1.1 + phase) * 10;
  const tents = [0, 1, 2, 3, 4, 5, 6].map((i) => {
    const x0 = 46 + i * 18;
    const s = Math.sin(t * 1.8 + phase + i * 0.9) * 14;
    return `M${x0} 120 C${x0 + s} 165, ${x0 - s} 215, ${x0 + s * 0.6} 275`;
  });
  return (
    <div style={{
      position: "absolute", left: x, top: y, width: size, height: size * 1.5,
      opacity: Math.min(1, p) * (0.35 + 0.65 * lit),
      transform: `translateY(${drift + float + interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.85, 1])})`,
      filter: `drop-shadow(0 0 ${Math.round(size * 0.14 * lit)}px ${color})`,
    }}>
      <svg viewBox="0 0 200 300" width="100%" height="100%" style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id={`jg${id}`} cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor={color} stopOpacity="0.95" />
            <stop offset="70%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </radialGradient>
        </defs>
        {tents.map((d, i) => (
          <path key={i} d={d} stroke={color} strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.6} />
        ))}
        <g transform={`translate(100 120) scale(${1 - pulse * 0.04} ${1 + pulse * 0.07}) translate(-100 -120)`}>
          <path d="M25 120 C25 35, 175 35, 175 120 C150 135, 50 135, 25 120 Z" fill={`url(#jg${id})`} stroke={color} strokeOpacity={0.8} strokeWidth={2} />
          <path d="M55 100 C70 70, 130 70, 145 100" stroke="#FFFFFF" strokeOpacity={0.35} fill="none" strokeWidth={3} strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

// Pairs of eyes blinking out of the dark (the "unknown creatures").
export const Eyes: React.FC<{ items: { x: number; y: number; s: number; t0: number }[] }> = ({ items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {items.map((it, i) => {
        const o = interpolate(frame, [it.t0, it.t0 + fps * 0.5, it.t0 + fps * 2.2, it.t0 + fps * 2.7], [0, 1, 1, 0], { easing: theme.ease.inOut, ...clamp });
        const dot: React.CSSProperties = { width: it.s * 2, height: it.s * 2, borderRadius: "50%", background: theme.colors.eye, boxShadow: `0 0 ${it.s * 5}px ${theme.colors.glowSoft}` };
        return (
          <div key={i} style={{ position: "absolute", left: it.x, top: it.y, display: "flex", gap: Math.round(it.s * 2.6), opacity: o * 0.9, transform: `scale(${0.8 + 0.2 * o})` }}>
            <div style={dot} /><div style={dot} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
