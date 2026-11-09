import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { FinalFade, BgMesh, Grade, Grain, Vignette } from "./components/Layers";
import { Particles } from "./components/Marine";
import { Sfx } from "./components/Sfx";
import { DepthScene } from "./scenes/DepthScene";
import { GlowScene } from "./scenes/GlowScene";
import { PressureScene } from "./scenes/PressureScene";
import { SurviveScene } from "./scenes/SurviveScene";
import { UnknownScene } from "./scenes/UnknownScene";
import { SCENE, sceneFrames, sec, theme } from "./theme";

export type MainProps = { previewVoiceover: boolean };

const Scene: React.FC<{ s: { from: number; to: number }; children: React.ReactNode }> = ({ s, children }) => (
  <Sequence from={sec(s.from)} durationInFrames={sceneFrames(s)}>{children}</Sequence>
);

export const Main: React.FC<MainProps> = ({ previewVoiceover }) => (
  <AbsoluteFill style={{ background: theme.colors.bg, fontFamily: theme.fonts.display }}>
    {/* 1 background mesh  2 assets  3 graphics/type  4 grade  5 grain + vignette */}
    <BgMesh />
    <Particles />
    <Scene s={SCENE.glow}><GlowScene /></Scene>
    <Scene s={SCENE.depth}><DepthScene /></Scene>
    <Scene s={SCENE.pressure}><PressureScene /></Scene>
    <Scene s={SCENE.survive}><SurviveScene /></Scene>
    <Scene s={SCENE.unknown}><UnknownScene /></Scene>
    <Grade />
    <Grain />
    <Vignette />
    <FinalFade />
    <Sfx />
    {/* Preview-only narration for timing checks. Put the file at public/voiceover.mp3,
        then toggle "previewVoiceover" in Remotion Studio's Props panel. Off by default → never in the render. */}
    {previewVoiceover ? <Audio src={staticFile("voiceover.mp3")} volume={1} /> : null}
  </AbsoluteFill>
);
