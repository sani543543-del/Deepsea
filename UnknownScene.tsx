import React from "react";
import { AbsoluteFill } from "remotion";
import { Eyes } from "../components/Marine";
import { SceneShell, WordReveal } from "../components/Text";
import { cue, local, SCENE, sec, theme } from "../theme";

// Cue 7: সমুদ্রের গভীরে এখনো — কত অজানা প্রাণী — লুকিয়ে আছে?
export const UnknownScene: React.FC = () => {
  const c7 = local(cue.c7, SCENE.unknown.from);
  const l2 = local(26.0, SCENE.unknown.from);
  const l3 = local(27.2, SCENE.unknown.from);
  const pts = [
    { x: 180, y: 200, s: 9 }, { x: 1700, y: 250, s: 12 }, { x: 300, y: 850, s: 8 }, { x: 1560, y: 830, s: 10 },
    { x: 940, y: 110, s: 7 }, { x: 1010, y: 960, s: 9 }, { x: 110, y: 540, s: 6 }, { x: 1790, y: 560, s: 8 },
  ].map((p, i) => ({ ...p, t0: c7 + sec(0.5 + i * 0.55) }));
  return (
    <SceneShell>
      <Eyes items={pts} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <WordReveal text="সমুদ্রের গভীরে এখনো" size={84} weight={500} color={theme.colors.textDim} delay={c7} align="center" />
          <WordReveal text="কত অজানা প্রাণী" size={160} delay={l2} hero="অজানা" align="center" gap={34} />
          <WordReveal text="লুকিয়ে আছে?" size={110} weight={600} delay={l3} align="center" />
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
