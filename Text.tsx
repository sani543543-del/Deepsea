import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Fade + rise + scale, springy.
export const Entrance: React.FC<{ delay?: number; y?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay = 0, y = 40, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.smooth });
  return (
    <div style={{ opacity: p, transform: `translateY(${interpolate(p, [0, 1], [y, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`, ...style }}>
      {children}
    </div>
  );
};

// Word-by-word reveal. Splits ONLY on spaces (never per glyph — Bengali conjuncts must not break).
export const WordReveal: React.FC<{
  text: string; size: number; delay?: number; per?: number; color?: string; weight?: number;
  hero?: string; gap?: number; maxWidth?: number; align?: "flex-start" | "center";
}> = ({ text, size, delay = 0, per = 3, color = theme.colors.text, weight = 700, hero, gap = 26, maxWidth, align = "flex-start" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <div style={{
      display: "flex", flexWrap: "wrap", justifyContent: align, columnGap: gap, maxWidth,
      fontFamily: theme.fonts.display, fontSize: size, fontWeight: weight, lineHeight: 1.4, letterSpacing: 0, color,
    }}>
      {text.split(" ").map((word, i) => {
        const start = delay + i * per;
        const p = spring({ frame: frame - start, fps, config: theme.spring.snappy });
        const sweep = spring({ frame: frame - start - 5, fps, config: theme.spring.smooth });
        const isHero = word === hero;
        const float = Math.sin(t * 1.6 + i * 0.8) * 3 * Math.min(1, p); // idle breathing
        return (
          <span key={i} style={{
            position: "relative", display: "inline-block", opacity: p,
            transform: `translateY(${interpolate(p, [0, 1], [34, 0]) + float}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
            color: isHero ? theme.colors.primary : color,
            textShadow: isHero ? `0 0 36px ${theme.colors.glow}, 0 0 90px ${theme.colors.glowSoft}` : "none",
          }}>
            {word}
            {isHero && (
              <span style={{
                position: "absolute", left: 0, bottom: Math.round(size * 0.1), height: Math.max(4, Math.round(size * 0.04)),
                width: `${Math.min(1, sweep) * 100}%`, borderRadius: 4, background: theme.colors.primary,
                boxShadow: `0 0 24px ${theme.colors.glow}`, opacity: 0.9,
              }} />
            )}
          </span>
        );
      })}
    </div>
  );
};

// Scene wrapper: every scene exits in ~10 frames (faster than its ~20-frame entrances).
export const SceneShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const exitLen = Math.round(fps / 3);
  const e = interpolate(frame, [durationInFrames - exitLen, durationInFrames - 2], [0, 1], { easing: theme.ease.in, ...clamp });
  return <AbsoluteFill style={{ opacity: 1 - e, transform: `translateY(${-36 * e}px) scale(${1 + 0.03 * e})` }}>{children}</AbsoluteFill>;
};
