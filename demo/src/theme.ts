import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const inter = loadInter("normal", { weights: ["400", "600", "800"], subsets: ["latin"] });
const mono = loadMono("normal", { weights: ["400", "700"], subsets: ["latin"] });

/** Mirrors the portfolio's "carbon" theme so the demo looks like the real site. */
export const C = {
  bg: "#0c0e12",
  sub: "#13161b",
  raise: "#1b1f26",
  line: "#272c35",
  dim: "#8b93a1",
  fg: "#e8ebf0",
  brand: "#9db4ff",
  brandDeep: "#6d8cff",
  green: "#7ee787",
  pink: "#fd6e88",
  amber: "#e3b341",
};

export const SANS = inter.fontFamily;
export const MONO = mono.fontFamily;
