import React from "react";
import { AbsoluteFill } from "remotion";
import { Counter, DepthGauge, TrenchProfile } from "../components/Hud";
import { Entrance, SceneShell, WordReveal } from "../components/Text";
import { cue, local, SCENE, theme } from "../theme";

// Cues 3–4: "Mariana Trench", ~১১ কিমি, "পৃথিবীর গভীরতম পরিচিত সমুদ্রখাত"
export const DepthScene: React.FC = () => {
  const c3 = local(cue.c3, SCENE.depth.from);
  const c4 = local(cue.c4, SCENE.depth.from);
  return (
    <SceneShell>
      <TrenchProfile delay={c3 + 6} top={760} />
      <DepthGauge x={200} y={130} height={600} delay={c3 + 8} />
      <AbsoluteFill style={{ paddingLeft: 420, paddingTop: 120 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <WordReveal text="Mariana Trench" size={150} delay={c3} />
          <Entrance delay={c3 + 12} y={50}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 28, fontFamily: theme.fonts.display }}>
              <Counter to={11} delay={c3 + 14} style={{ fontSize: 220, fontWeight: 700, lineHeight: 1.25, color: theme.colors.primary, textShadow: `0 0 36px ${theme.colors.glow}, 0 0 90px ${theme.colors.glowSoft}` }} />
              <span style={{ fontSize: 90, fontWeight: 600, color: theme.colors.textDim }}>কিমি</span>
            </div>
          </Entrance>
          <WordReveal text="পৃথিবীর গভীরতম পরিচিত সমুদ্রখাত" size={56} weight={500} color={theme.colors.textDim} delay={c4} gap={16} />
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
