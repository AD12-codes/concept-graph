import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ClaudeCode } from "@/components/remocn/claude-code";
import { C, MONO } from "@/theme";
import { DotGrid } from "./Intro";

export const SkillScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <DotGrid />
      <Caption step="01" text="run the skill in any repo" from={10} />
      <div style={{ position: "absolute", inset: 0, scale: "0.84", translate: "0 34px" }}>
      <ClaudeCode
        title="Claude Code"
        userName="anshul"
        model="Fable 5.1"
        cwd="~/projects/type-ninja"
        placeholder='Try "/concept-graph <slug> <repo>"'
        prompt="/concept-graph typeninja ."
        accentColor={C.brand}
      />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 48,
          textAlign: "center",
          fontFamily: MONO,
          fontSize: 24,
          color: C.dim,
          opacity: interpolate(frame, [110, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        one slug, one path. the skill reads the repo and does the rest.
      </div>
    </AbsoluteFill>
  );
};

export const Caption: React.FC<{ step: string; text: string; from: number }> = ({ step, text, from }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: 44,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: MONO,
        fontSize: 26,
        color: C.dim,
        letterSpacing: "0.08em",
        opacity: interpolate(frame, [from, from + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        translate: `0 ${interpolate(frame, [from, from + 18], [-10, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px`,
      }}
    >
      <span style={{ color: C.brand, fontWeight: 700 }}>{step}</span>
      {"  "}
      {text}
    </div>
  );
};
