import React from "react";
import { AbsoluteFill } from "remotion";
import { Jelly } from "../components/Marine";
import { SceneShell, WordReveal } from "../components/Text";
import { cue, local, SCENE, theme } from "../theme";

// Cue 6: ভয়ঙ্কর পরিবেশেও বেঁচে থাকে প্রাণ
export const SurviveScene: React.FC = () => {
  const c6 = local(cue.c6, SCENE.survive.from);
  const l2 = local(21.3, SCENE.survive.from);
  return (
    <SceneShell>
      <Jelly x={1260} y={130} size={520} delay={c6 + 10} phase={1} rise={90} />
      <Jelly x={1000} y={560} size={190} delay={c6 + 22} phase={3} color={theme.colors.eye} rise={50} />
      <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 180 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <WordReveal text="ভয়ঙ্কর পরিবেশেও" size={130} delay={c6} color={theme.colors.text} />
          <WordReveal text="বেঁচে থাকে প্রাণ" size={130} delay={l2} hero="প্রাণ" />
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
