import React from "react";
import { Composition } from "remotion";
import { Main, MainProps } from "./Main";
import { DURATION, FPS, HEIGHT, WIDTH } from "./theme";

export const Root: React.FC = () => (
  <Composition
    id="Main"
    component={Main}
    durationInFrames={DURATION}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={{ previewVoiceover: false } satisfies MainProps}
  />
);
