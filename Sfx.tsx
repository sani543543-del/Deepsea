import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { sec } from "../theme";

const LEN: Record<string, number> = { whoosh: 0.5, pop: 0.22, click: 0.08, tick: 0.06, chime: 1.0, swell: 1.6 };
type Ev = { at: number; f: keyof typeof LEN; v: number; r?: number };

// Same 6 sounds throughout; only entries, highlights, counters and transitions get one.
// Each lands ~2–3 frames before its visual.
const EVENTS: Ev[] = [
  { at: 0.4, f: "whoosh", v: 0.5 },
  { at: 3.75, f: "click", v: 0.6 }, { at: 3.95, f: "chime", v: 0.55 },
  { at: 7.1, f: "whoosh", v: 0.5, r: 0.95 }, { at: 7.62, f: "pop", v: 0.6 },
  { at: 8.0, f: "tick", v: 0.7, r: 1.0 }, { at: 8.25, f: "tick", v: 0.7, r: 1.05 }, { at: 8.5, f: "tick", v: 0.7, r: 1.1 },
  { at: 8.8, f: "tick", v: 0.6, r: 1.15 }, { at: 9.15, f: "tick", v: 0.5, r: 1.2 }, { at: 9.55, f: "tick", v: 0.4, r: 1.25 },
  { at: 12.12, f: "pop", v: 0.45, r: 0.9 },
  { at: 14.9, f: "whoosh", v: 0.5, r: 1.1 }, { at: 15.28, f: "pop", v: 0.6, r: 0.85 },
  { at: 15.7, f: "tick", v: 0.7, r: 1.0 }, { at: 15.9, f: "tick", v: 0.7, r: 1.05 }, { at: 16.1, f: "tick", v: 0.7, r: 1.1 },
  { at: 16.3, f: "tick", v: 0.6, r: 1.15 }, { at: 16.55, f: "tick", v: 0.5, r: 1.2 }, { at: 16.85, f: "tick", v: 0.4, r: 1.25 },
  { at: 17.4, f: "chime", v: 0.4, r: 0.8 },
  { at: 19.7, f: "whoosh", v: 0.5, r: 0.9 }, { at: 20.02, f: "pop", v: 0.55 },
  { at: 21.3, f: "click", v: 0.55 }, { at: 21.4, f: "chime", v: 0.45, r: 1.2 },
  { at: 23.2, f: "whoosh", v: 0.5, r: 0.85 }, { at: 23.5, f: "swell", v: 0.9 }, { at: 23.58, f: "pop", v: 0.4, r: 0.8 },
  { at: 25.95, f: "click", v: 0.5, r: 0.9 }, { at: 26.0, f: "chime", v: 0.4, r: 0.75 },
];

export const Sfx: React.FC = () => (
  <>
    {EVENTS.map((e, i) => (
      <Sequence key={i} from={sec(e.at)} durationInFrames={sec(LEN[e.f]) + 4}>
        <Audio src={staticFile(`sfx/${e.f}.wav`)} volume={e.v * 0.35} playbackRate={e.r ?? 1} />
      </Sequence>
    ))}
  </>
);
