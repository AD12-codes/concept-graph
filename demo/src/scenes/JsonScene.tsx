import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { GRAPH } from "@/data/graph";
import { C, MONO, SANS } from "@/theme";
import { DotGrid } from "./Intro";
import { Caption } from "./SkillScene";

type Tok = { text: string; color: string };
function tokenizeJsonLine(line: string): Tok[] {
  const out: Tok[] = [];
  const re = /("(?:[^"\\]|\\.)*")(\s*:)?|(\btrue\b|\bfalse\b|\bnull\b)|(-?\d+(?:\.\d+)?)|([{}\[\],])|(\s+)|(.)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m[1] !== undefined) out.push({ text: m[1] + (m[2] ?? ""), color: m[2] ? C.brand : C.green });
    else if (m[3]) out.push({ text: m[3], color: C.pink });
    else if (m[4]) out.push({ text: m[4], color: C.amber });
    else if (m[5]) out.push({ text: m[5], color: C.dim });
    else out.push({ text: m[0], color: C.fg });
  }
  return out;
}

const LINES = GRAPH.rawJson.split("\n");
const LINE_H = 27;

const CALLOUTS = [
  { at: 40, title: "one file per project", body: "static JSON, committed next to the code. nothing runs at request time." },
  { at: 95, title: "ids are paths", body: "security/server-side-result-validation. the parent is the id minus its last segment." },
  { at: 150, title: "every concept points at real code", body: "file, line range, trimmed snippet, and a note on what to look at." },
];

export const JsonScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scroll = interpolate(frame, [60, 200], [0, Math.max(0, LINES.length * LINE_H - 760)], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.6, 1) });
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <DotGrid />
      <Caption step="03" text="the output is plain JSON" from={6} />
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 130,
          width: 1130,
          height: 860,
          borderRadius: 14,
          background: C.sub,
          border: `1px solid ${C.line}`,
          overflow: "hidden",
          boxShadow: "0 40px 90px -40px rgba(0,0,0,0.8)",
          opacity: interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ height: 48, background: C.raise, borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", paddingLeft: 18, fontFamily: MONO, fontSize: 17, color: C.dim, gap: 10 }}>
          <span style={{ color: C.amber }}>{"{}"}</span> concepts/typeninja.json
          <span style={{ marginLeft: "auto", marginRight: 18, opacity: 0.7 }}>{GRAPH.nodeCount} nodes · {GRAPH.generatedAt}</span>
        </div>
        <div style={{ position: "absolute", top: 49, left: 0, right: 0, bottom: 0, overflow: "hidden" }}>
        <div style={{ padding: "22px 0 0 0", fontFamily: MONO, fontSize: 19, lineHeight: `${LINE_H}px`, translate: `0 ${-scroll}px` }}>
          {LINES.map((line, i) => {
            const o = interpolate(frame, [8 + i * 2, 16 + i * 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={i} style={{ display: "flex", opacity: o, whiteSpace: "pre" }}>
                <span style={{ width: 64, textAlign: "right", paddingRight: 22, color: C.line, flexShrink: 0 }}>{i + 1}</span>
                <span>
                  {tokenizeJsonLine(line).map((t, j) => (
                    <span key={j} style={{ color: t.color }}>{t.text}</span>
                  ))}
                </span>
              </div>
            );
          })}
        </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 1300, top: 190, width: 520, display: "flex", flexDirection: "column", gap: 34 }}>
        {CALLOUTS.map((c, i) => (
          <div
            key={i}
            style={{
              borderLeft: `3px solid ${C.brand}`,
              paddingLeft: 22,
              opacity: interpolate(frame, [c.at, c.at + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              translate: `${interpolate(frame, [c.at, c.at + 18], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) })}px 0`,
            }}
          >
            <div style={{ fontFamily: SANS, fontSize: 32, fontWeight: 800, color: C.fg, marginBottom: 8 }}>{c.title}</div>
            <div style={{ fontFamily: SANS, fontSize: 23, lineHeight: 1.45, color: C.dim }}>{c.body}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
