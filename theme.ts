// theme.ts — single source of truth: timing, colors, easings, springs, fonts.
import { Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/HindSiliguri";

const { fontFamily } = loadFont("normal", {
  weights: ["500", "600", "700"],
  subsets: ["bengali", "latin"],
});

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const sec = (s: number) => Math.round(s * FPS);

// SRT cue start times (seconds) — the single time reference for the whole video.
export const cue = { c1: 0.5, c2: 3.873, c3: 7.72, c4: 12.24, c5: 15.36, c6: 20.1, c7: 23.64, end: 28.04 };

// Scene windows (seconds). Each scene covers its SRT cues.
export const SCENE = {
  glow: { from: 0, to: 7.2 },
  depth: { from: 7.2, to: 15.0 },
  pressure: { from: 15.0, to: 19.8 },
  survive: { from: 19.8, to: 23.3 },
  unknown: { from: 23.3, to: 29.0 },
} as const;
export const DURATION = sec(29.0);

/** frame (local to a scene) at which an absolute time in seconds occurs */
export const local = (absSeconds: number, sceneFromSeconds: number) => sec(absSeconds - sceneFromSeconds);
export const sceneFrames = (s: { from: number; to: number }) => sec(s.to) - sec(s.from);

export const toBn = (n: number) => String(Math.round(n)).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);

export const theme = {
  colors: {
    bg: "#020914",
    bgAlt: "#051B33",
    deep: "#07294B",
    teal: "rgba(11,111,134,0.55)",
    primary: "#3DF2D6", // THE hero color — one element per frame
    accent: "#4FA8FF",
    eye: "#A6E9FF",
    text: "#EAF8FF",
    textDim: "#8DB4C9",
    glow: "rgba(61,242,214,0.45)",
    glowSoft: "rgba(79,168,255,0.35)",
  },
  fonts: { display: fontFamily, body: fontFamily },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
  },
} as const;
