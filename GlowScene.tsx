import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Jelly } from "../components/Marine";
import { SceneShell, WordReveal } from "../components/Text";
import { cue, local, SCENE, sec, theme } from "../theme";

// Cues 1–2: "সমুদ্রের গভীরে … নিজের শরীর থেকে আলো"
export const GlowScene: React.FC = () => {
  const frame = useCurrentFrame();
  const c1 = local(cue.c1, SCENE.glow.from);
  const c2 = local(cue.c2, SCENE.glow.from);
  const lit = interpolate(frame, [c2 - 6, c2 + sec(0.7)], [0, 1], { easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dim = interpolate(frame, [c2, c2 + 18], [1, 0.45], { easing: theme.ease.inOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <SceneShell>
      <Jelly x={1180} y={150} size={440} delay={c1 + 6} phase={0} lit={lit} />
      <Jelly x={1560} y={420} size={270} delay={c1 + 14} phase={2} color={theme.colors.eye} lit={lit} rise={80} />
      <Jelly x={1080} y={560} size={200} delay={c1 + 22} phase={4} lit={lit} rise={50} />
      <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 180 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ opacity: dim }}><WordReveal text="সমুদ্রের গভীরে" size={150} delay={c1} /></div>
          <WordReveal text="নিজের শরীর থেকে আলো" size={120} delay={c2} hero="আলো" maxWidth={960} />
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
