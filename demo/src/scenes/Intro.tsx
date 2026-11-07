import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SoftBlurIn } from "@/components/remocn/soft-blur-in";
import { C, MONO, SANS } from "@/theme";

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <DotGrid />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 330,
          textAlign: "center",
          fontFamily: MONO,
          fontSize: 26,
          letterSpacing: "0.3em",
          color: C.dim,
          textTransform: "uppercase",
          opacity: interpolate(frame, [0, 0.6 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        a claude code skill
      </div>
      <div style={{ position: "absolute", inset: 0, top: -40 }}>
        <SoftBlurIn text="concept graph" fontSize={168} fontWeight={800} color={C.fg} blur={18} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 690,
          textAlign: "center",
          fontFamily: SANS,
          fontSize: 44,
          color: C.dim,
          opacity: interpolate(frame, [1.2 * fps, 1.9 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
          translate: `0 ${interpolate(frame, [1.2 * fps, 1.9 * fps], [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) })}px`,
        }}
      >
        the ideas inside your code, explained with <span style={{ color: C.brand }}>your code</span>.
      </div>
    </AbsoluteFill>
  );
};

export const DotGrid: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundImage: "radial-gradient(rgba(255,255,255,0.09) 1.5px, transparent 1.5px)",
      backgroundSize: "28px 28px",
      maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
      WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
    }}
  />
);
