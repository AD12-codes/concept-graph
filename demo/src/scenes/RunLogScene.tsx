import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { GRAPH } from "@/data/graph";
import { C, MONO } from "@/theme";
import { DotGrid } from "./Intro";
import { Caption } from "./SkillScene";

const LINES: Array<{ at: number; kind: "cmd" | "step" | "ok" | "row" | "blank"; text: string }> = [
  { at: 10, kind: "cmd", text: "/concept-graph typeninja ." },
  { at: 30, kind: "step", text: "orient    package.json · README · AGENTS.md · commit c4b8df7" },
  { at: 48, kind: "step", text: "hunt      auth · middleware · schemas · stores · queues · env · docker · tests" },
  { at: 66, kind: "step", text: "cite      every concept gets a real snippet with file + line range" },
  { at: 84, kind: "step", text: "explain   what it solves · how it works here · what breaks without it" },
  { at: 102, kind: "step", text: "scrub     no secrets, no .env, no personal data" },
  { at: 122, kind: "ok", text: "wrote concepts/typeninja.json" },
  { at: 140, kind: "blank", text: "" },
  { at: 142, kind: "cmd", text: "node .claude/skills/concept-graph/validate.mjs concepts/typeninja.json" },
  { at: 158, kind: "ok", text: `concepts/typeninja.json: ${GRAPH.nodeCount} nodes in ${GRAPH.categories.length} categories` },
  ...[...GRAPH.categories]
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .map((c, i) => ({ at: 166 + i * 5, kind: "row" as const, text: `${c.id.padEnd(20)} ${c.count}` })),
  { at: 200, kind: "row", text: "…" },
];

export const RunLogScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <DotGrid />
      <Caption step="02" text="it reads, hunts, cites and validates" from={6} />
      <div
        style={{
          position: "absolute",
          left: 220,
          top: 150,
          width: 1480,
          height: 800,
          borderRadius: 14,
          background: C.sub,
          border: `1px solid ${C.line}`,
          boxShadow: "0 40px 90px -40px rgba(0,0,0,0.8)",
          overflow: "hidden",
          opacity: interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          scale: `${interpolate(frame, [0, 20], [0.97, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) })}`,
        }}
      >
        <div style={{ height: 48, background: C.raise, borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", gap: 9, paddingLeft: 18, fontFamily: MONO, fontSize: 17, color: C.dim }}>
          <span style={{ width: 13, height: 13, borderRadius: 7, background: "#FF5F57" }} />
          <span style={{ width: 13, height: 13, borderRadius: 7, background: "#FEBC2E" }} />
          <span style={{ width: 13, height: 13, borderRadius: 7, background: "#28C840" }} />
          <span style={{ marginLeft: 14 }}>~/projects/type-ninja — claude</span>
        </div>
        <div style={{ padding: "30px 38px", fontFamily: MONO, fontSize: 25, lineHeight: "44px", color: C.fg }}>
          {LINES.map((line, i) => {
            const o = interpolate(frame, [line.at, line.at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            if (line.kind === "blank") return <div key={i} style={{ height: 22 }} />;
            return (
              <div key={i} style={{ opacity: o, translate: `0 ${(1 - o) * 6}px`, whiteSpace: "pre", display: "flex", gap: 16 }}>
                {line.kind === "cmd" && <span style={{ color: C.brand }}>$</span>}
                {line.kind === "step" && <span style={{ color: C.dim }}>→</span>}
                {line.kind === "ok" && <span style={{ color: C.green }}>✓</span>}
                {line.kind === "row" && <span style={{ color: "transparent" }}>✓</span>}
                <span style={{ color: line.kind === "row" ? C.dim : line.kind === "step" ? C.fg : C.fg, fontWeight: line.kind === "cmd" ? 700 : 400 }}>
                  {line.text}
                </span>
              </div>
            );
          })}
          <span style={{ display: "inline-block", width: 14, height: 30, background: C.brand, marginLeft: 36, verticalAlign: "middle", opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
