// Synthesizes a tiny, clean SFX kit as 16-bit mono WAVs (no downloads).
import fs from "node:fs";
import path from "node:path";
const SR = 44100;
const out = path.resolve("public/sfx");
fs.mkdirSync(out, { recursive: true });

let seed = 1234567;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;

const lp = (x, fc) => { const a = 1 - Math.exp(-2 * Math.PI * fc / SR); let y = 0; return x.map(v => (y += a * (v - y))); };
const hp = (x, fc) => { const l = lp(x, fc); return x.map((v, i) => v - l[i]); };
const env = (n, att, dec) => Array.from({ length: n }, (_, i) => {
  const t = i / SR; const a = Math.min(1, t / att); return a * Math.exp(-t / dec);
});
const normalize = (x, peak) => { const m = Math.max(...x.map(Math.abs)) || 1; return x.map(v => (v / m) * peak); };
const fadeEnds = (x) => { const f = Math.floor(SR * 0.004); return x.map((v, i) => v * Math.min(1, i / f, (x.length - 1 - i) / f)); };

function write(name, x, peak) {
  x = fadeEnds(normalize(x, peak));
  const buf = Buffer.alloc(44 + x.length * 2);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + x.length * 2, 4); buf.write("WAVEfmt ", 8);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(x.length * 2, 40);
  x.forEach((v, i) => buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v)) * 32767), 44 + i * 2));
  fs.writeFileSync(path.join(out, name), buf);
  console.log(name.padEnd(14), (x.length / SR).toFixed(2) + "s", "peak", Math.max(...x.map(Math.abs)).toFixed(2));
}

// whoosh: band-ish noise sweep, soft fade in/out (0.5s)
{ const n = Math.floor(SR * 0.5); let noise = Array.from({ length: n }, rnd);
  const lo = lp(noise, 2600), hi = hp(lo, 500);
  const x = hi.map((v, i) => { const t = i / n; return v * Math.sin(Math.PI * t) ** 1.6 * (0.4 + 0.6 * t); });
  write("whoosh.wav", x, 0.32); }

// pop: sine with fast pitch drop (0.22s)
{ const n = Math.floor(SR * 0.22); let ph = 0;
  const e = env(n, 0.002, 0.05);
  const x = Array.from({ length: n }, (_, i) => { const f = 180 + 620 * Math.exp(-i / SR / 0.025); ph += 2 * Math.PI * f / SR; return Math.sin(ph) * e[i]; });
  write("pop.wav", x, 0.34); }

// click: very short high-passed noise burst (0.08s)
{ const n = Math.floor(SR * 0.08); const e = env(n, 0.0005, 0.012);
  const x = hp(Array.from({ length: n }, rnd), 2200).map((v, i) => v * e[i]);
  write("click.wav", x, 0.28); }

// tick: tiny sine blip for counters (0.06s)
{ const n = Math.floor(SR * 0.06); const e = env(n, 0.001, 0.01);
  const x = Array.from({ length: n }, (_, i) => Math.sin(2 * Math.PI * 1800 * i / SR) * e[i]);
  write("tick.wav", x, 0.2); }

// chime: soft sine + overtones, low-passed, gentle decay (1.0s)
{ const n = Math.floor(SR * 1.0); const e = env(n, 0.004, 0.28);
  const f0 = 659.25; // E5
  let x = Array.from({ length: n }, (_, i) => { const t = i / SR;
    return (Math.sin(2 * Math.PI * f0 * t) + 0.35 * Math.sin(2 * Math.PI * f0 * 2.01 * t) + 0.12 * Math.sin(2 * Math.PI * f0 * 3.02 * t)) * e[i]; });
  x = lp(x, 5000);
  // very small echo as "reverb"
  const d = Math.floor(SR * 0.09); x = x.map((v, i) => v + (i >= d ? 0.22 * x[i - d] : 0));
  write("chime.wav", x, 0.3); }

// swell: low airy pad for the final question (1.6s)
{ const n = Math.floor(SR * 1.6);
  let x = Array.from({ length: n }, (_, i) => { const t = i / SR; const w = Math.sin(Math.PI * i / n) ** 2;
    return (Math.sin(2 * Math.PI * 110 * t) + Math.sin(2 * Math.PI * 110.7 * t) * 0.8 + Math.sin(2 * Math.PI * 165 * t) * 0.3) * w; });
  write("swell.wav", lp(x, 900), 0.22); }
