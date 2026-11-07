import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { SoftBlurIn } from "@/components/remocn/soft-blur-in";
import { C, MONO, SANS } from "@/theme";
import { DotGrid } from "./Intro";

const Row: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        opacity: interpolate(frame, [at, at + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        translate: `0 ${interpolate(frame, [at, at + 16], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) })}px`,
      }}
    >
      {children}
    </div>
  );
};

export const Outro: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <DotGrid />
    <div style={{ position: "absolute", inset: 0, top: -480 }}>
      <SoftBlurIn text="try it on your repo" fontSize={108} fontWeight={800} color={C.fg} blur={16} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
      <Row at={30}>
        <div style={{ background: C.sub, border: `1px solid ${C.line}`, borderRadius: 14, padding: "26px 40px", fontFamily: MONO, fontSize: 27, color: C.fg, lineHeight: 1.7, textAlign: "left" }}>
          <div><span style={{ color: C.brand }}>$</span> npx degit AD12-codes/concept-graph/concept-graph .claude/skills/concept-graph</div>
          <div><span style={{ color: C.brand }}>$</span> claude <span style={{ color: C.dim }}># then: /concept-graph my-app .</span></div>
        </div>
      </Row>
      <Row at={60}>
        <div style={{ display: "flex", gap: 56, fontFamily: SANS, fontSize: 30, fontWeight: 600, marginTop: 16 }}>
          <span style={{ color: C.brand }}>ad12-codes.work/viewer</span>
          <span style={{ color: C.dim }}>github.com/AD12-codes/concept-graph</span>
        </div>
      </Row>
      <Row at={84}>
        <div style={{ fontFamily: MONO, fontSize: 22, color: C.dim, marginTop: 10 }}>MIT · built by Anshul Dharmadhikari · ad12-codes.work</div>
      </Row>
    </div>
  </AbsoluteFill>
);
