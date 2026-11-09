import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { DURATION, sec, theme } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Layer 1 — Gradient Fluid background: slow-flowing blurred blobs that darken as we "descend".
export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const p = interpolate(frame, [0, DURATION], [0, 1], { easing: theme.ease.inOut, ...clamp });
  const top = interpolateColors(p, [0, 0.55, 1], [theme.colors.deep, theme.colors.bgAlt, theme.colors.bg]);
  const blobA = interpolateColors(p, [0, 1], ["rgba(14,120,150,0.60)", "rgba(10,60,110,0.35)"]);
  const blobB = interpolateColors(p, [0, 1], ["rgba(79,168,255,0.30)", "rgba(79,168,255,0.14)"]);
  const blobC = interpolateColors(p, [0, 1], ["rgba(61,242,214,0.16)", "rgba(61,242,214,0.07)"]);
  const rays = interpolate(p, [0, 0.35], [1, 0], { ...clamp });

  const blob = (size: number, left: number, top_: number, color: string, blur: number, ax: number, ay: number, sp: number): React.CSSProperties => ({
    position: "absolute", width: size, height: size, borderRadius: "50%", filter: `blur(${blur}px)`,
    left: left + Math.sin(t * sp) * ax, top: top_ + Math.cos(t * sp * 0.8) * ay,
    background: `radial-gradient(circle, ${color}, transparent 66%)`,
  });

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${top} 0%, ${theme.colors.bg} 100%)` }}>
      <div style={blob(1300, -350, -400, blobA, 70, 90, 60, 0.45)} />
      <div style={blob(1100, 1000, 300, blobB, 80, 110, 70, 0.35)} />
      <div style={blob(800, 500, 650, blobC, 90, 130, 50, 0.55)} />
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          position: "absolute", top: -80, left: 300 + i * 420, width: 300, height: 1000, opacity: rays * (0.5 - i * 0.12),
          background: "linear-gradient(180deg, rgba(150,225,255,0.22), transparent 75%)",
          transform: `skewX(${-14 + Math.sin(t * 0.5 + i) * 3}deg)`, filter: "blur(22px)",
        }} />
      ))}
    </AbsoluteFill>
  );
};

// Layer 4 — colour grade
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.accent, mixBlendMode: "soft-light", opacity: 0.2 }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.12), transparent 28%, transparent 70%, rgba(0,0,0,0.25))" }} />
  </AbsoluteFill>
);

// Layer 5a — procedural film grain
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill style={{
      pointerEvents: "none", backgroundImage: noise, backgroundSize: "220px",
      backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`, opacity: 0.07, mixBlendMode: "overlay",
    }} />
  );
};

// Layer 5b — vignette
export const Vignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.5) 100%)" }} />
);

// Closing fade to black
export const FinalFade: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [sec(28.2), DURATION - 1], [0, 1], { easing: theme.ease.in, ...clamp });
  return <AbsoluteFill style={{ background: theme.colors.bg, opacity: o, pointerEvents: "none" }} />;
};
