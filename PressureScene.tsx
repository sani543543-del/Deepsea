import React from "react";
import { AbsoluteFill } from "remotion";
import { Counter, PressureRings } from "../components/Hud";
import { Entrance, SceneShell } from "../components/Text";
import { cue, local, SCENE, sec, theme } from "../theme";

// Cue 5: পানির চাপ — ১০০০× — সমুদ্রপৃষ্ঠের তুলনায়
export const PressureScene: React.FC = () => {
  const c5 = local(cue.c5, SCENE.pressure.from);
  return (
    <SceneShell>
      <PressureRings delay={c5} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, fontFamily: theme.fonts.display }}>
          <Entrance delay={c5}><div style={{ fontSize: 72, fontWeight: 600, color: theme.colors.textDim, lineHeight: 1.4 }}>পানির চাপ</div></Entrance>
          <Entrance delay={c5 + 6} y={60}>
            <Counter to={1000} suffix="×" delay={c5 + 8} style={{ fontSize: 290, fontWeight: 700, lineHeight: 1.25, color: theme.colors.primary, textShadow: `0 0 40px ${theme.colors.glow}, 0 0 100px ${theme.colors.glowSoft}` }} />
          </Entrance>
          <Entrance delay={c5 + sec(0.9)}><div style={{ fontSize: 56, fontWeight: 500, color: theme.colors.text, lineHeight: 1.4 }}>সমুদ্রপৃষ্ঠের তুলনায়</div></Entrance>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
