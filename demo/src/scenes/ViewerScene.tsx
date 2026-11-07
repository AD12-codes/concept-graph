import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SimulatedCursor } from "@/components/remocn/simulated-cursor";
import { C, MONO } from "@/theme";

/** Cursor legs are 24 frames of travel plus the hold on the destination point. */
export const CHIP = { x: 1108, y: 565 };

export const ViewerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const clickAt = 24 + 30 + 24; // start hold, then second leg arrives
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Img
        src={staticFile("viewer-idle.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: 1920,
          height: 1080,
          opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: CHIP.x - 48,
          top: CHIP.y - 20,
          width: 96,
          height: 40,
          borderRadius: 8,
          boxShadow: `0 0 0 3px ${C.brand}`,
          opacity: interpolate(frame, [clickAt, clickAt + 6, clickAt + 40], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          scale: `${interpolate(frame, [clickAt, clickAt + 30], [1, 1.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) })}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 100,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ background: "rgba(12,14,18,0.92)", border: `1px solid ${C.line}`, borderRadius: 12, padding: "16px 28px", fontFamily: MONO, fontSize: 24, color: C.fg }}>
          <span style={{ color: C.brand, fontWeight: 700 }}>04</span>
          <span style={{ color: C.dim }}>  open it at </span>
          <span style={{ color: C.brand }}>ad12-codes.work/viewer</span>
          <span style={{ color: C.dim }}> · drop the file, paste the JSON, or load it from a raw GitHub URL</span>
        </div>
      </div>
      <SimulatedCursor
        color={C.fg}
        size={34}
        points={[
          { x: 1500, y: 880 },
          { x: 1500, y: 880, hold: 30 },
          { x: CHIP.x, y: CHIP.y, hold: 60, click: true },
        ]}
      />
    </AbsoluteFill>
  );
};
