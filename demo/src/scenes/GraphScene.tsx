import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { SimulatedCursor } from "@/components/remocn/simulated-cursor";
import { GRAPH } from "@/data/graph";
import { C, MONO, SANS } from "@/theme";
import { CATEGORIES, CX, CY, categoryIndex, categoryPos, childIndex, childPos } from "./graph-layout";

const CLOSE = { x: 1846, y: 96 };
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

/**
 * The storyboard, in local frames. Cursor legs take 24 frames of travel
 * plus the hold at the destination, so arrivals are: 24 → 74 → 108 → 252 → 282 → 316 → 460 → 490 → 524.
 */
const ACTS = GRAPH.picked.map((node, i) => {
  const ci = categoryIndex(node.category);
  const k = childIndex(node.category, node.id);
  const n = CATEGORIES[ci].nodes.length;
  return { node, ci, k, n, cat: categoryPos(ci), child: childPos(ci, k, n) };
});
const T = {
  cat: [74, 282, 490],
  open: [110, 318, 526],
  close: [252, 460, 10_000],
};

export const GraphScene: React.FC = () => {
  const frame = useCurrentFrame();
  const activeAct = T.cat.findLastIndex((t) => frame >= t);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1.5px, transparent 1.5px)", backgroundSize: "28px 28px" }} />
      <Header />

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {CATEGORIES.map((cat, i) => {
          const p = categoryPos(i);
          const t = interpolate(frame, [8 + i * 2, 34 + i * 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
          const x = CX + (p.x - CX) * t;
          const y = CY + (p.y - CY) * t;
          const act = ACTS.findIndex((a) => a.ci === i);
          const isActive = act >= 0 && activeAct === act;
          const open = act >= 0 ? interpolate(frame, [T.cat[act] + 4, T.cat[act] + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE }) : 0;
          const openAmount = act >= 0 && isActive ? open : act >= 0 && activeAct > act ? interpolate(frame, [T.cat[act + 1], T.cat[act + 1] + 14], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
          return (
            <g key={cat.id}>
              <line x1={CX} y1={CY} x2={x} y2={y} stroke={C.line} strokeWidth={2} opacity={t} />
              {act >= 0 &&
                cat.nodes.map((node, k) => {
                  const cp = childPos(i, k, cat.nodes.length);
                  const stagger = interpolate(openAmount, [k / cat.nodes.length / 2, 0.5 + k / cat.nodes.length / 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  const nx = p.x + (cp.x - p.x) * stagger;
                  const ny = p.y + (cp.y - p.y) * stagger;
                  const picked = ACTS[act].node.id === node.id;
                  const lit = picked ? interpolate(frame, [T.open[act] - 6, T.open[act] + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
                  return (
                    <g key={node.id} opacity={stagger}>
                      <line x1={p.x} y1={p.y} x2={nx} y2={ny} stroke={C.brand} strokeWidth={1.5} opacity={0.45} />
                      <circle cx={nx} cy={ny} r={12 + lit * 4} fill={lit > 0 ? C.brand : C.sub} stroke={C.brand} strokeWidth={2} />
                      <text x={nx - 24} y={ny + 7} textAnchor="end" fontFamily={MONO} fontSize={17} fill={lit > 0 ? C.fg : C.dim} style={{ fontWeight: lit > 0 ? 700 : 400 }}>
                        {node.title.length > 34 ? node.title.slice(0, 32) + "…" : node.title}
                      </text>
                    </g>
                  );
                })}
              <circle cx={x} cy={y} r={18 * t + openAmount * 4} fill={C.brand} opacity={0.18 + 0.82 * t} />
              <circle cx={x} cy={y} r={(18 * t + openAmount * 4) * 0.55} fill={C.bg} opacity={openAmount} />
              <text x={x} y={y + 44} textAnchor="middle" fontFamily={MONO} fontSize={20} fill={C.fg} opacity={t} style={{ fontWeight: 600 }}>
                {cat.label}
              </text>
            </g>
          );
        })}
        <circle cx={CX} cy={CY} r={interpolate(frame, [0, 18], [0, 32], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE })} fill={C.brand} />
        <text x={CX} y={CY + 64} textAnchor="middle" fontFamily={MONO} fontSize={26} fill={C.fg} style={{ fontWeight: 700 }} opacity={interpolate(frame, [6, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          {GRAPH.name}
        </text>
      </svg>

      {ACTS.map((act, i) => (
        <Dialog key={act.node.id} node={act.node} openAt={T.open[i]} closeAt={T.close[i]} />
      ))}

      <SimulatedCursor
        color={C.fg}
        size={34}
        points={[
          { x: 1500, y: 980 },
          { x: 1500, y: 980, hold: 26 },
          { x: ACTS[0].cat.x, y: ACTS[0].cat.y, hold: 10, click: true },
          { x: ACTS[0].child.x, y: ACTS[0].child.y, hold: 120, click: true },
          { x: CLOSE.x, y: CLOSE.y, hold: 6, click: true },
          { x: ACTS[1].cat.x, y: ACTS[1].cat.y, hold: 10, click: true },
          { x: ACTS[1].child.x, y: ACTS[1].child.y, hold: 120, click: true },
          { x: CLOSE.x, y: CLOSE.y, hold: 6, click: true },
          { x: ACTS[2].cat.x, y: ACTS[2].cat.y, hold: 10, click: true },
          { x: ACTS[2].child.x, y: ACTS[2].child.y, hold: 400, click: true },
        ]}
      />
    </AbsoluteFill>
  );
};

const Header: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 68,
        borderBottom: `1px solid ${C.line}`,
        background: "rgba(12,14,18,0.85)",
        display: "flex",
        alignItems: "center",
        padding: "0 36px",
        fontFamily: MONO,
        fontSize: 21,
        color: C.dim,
        opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}
    >
      <span>← load another</span>
      <span style={{ margin: "0 16px", color: C.line }}>/</span>
      <span style={{ color: C.fg, fontWeight: 700 }}>{GRAPH.name}</span>
      <span>&nbsp;· concept graph</span>
      <span style={{ marginLeft: "auto" }}>
        <span style={{ color: C.brand }}>{GRAPH.nodeCount}</span> concepts · <span style={{ color: C.brand }}>{GRAPH.categories.length}</span> categories · click a category, then a concept
      </span>
    </div>
  );
};

function renderInline(text: string, key: string) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith("**")) return <strong key={`${key}-${i}`} style={{ color: C.fg, fontWeight: 800 }}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`")) return <code key={`${key}-${i}`} style={{ fontFamily: MONO, fontSize: "0.9em", color: C.brand }}>{part.slice(1, -1)}</code>;
    return <span key={`${key}-${i}`}>{part}</span>;
  });
}

const Dialog: React.FC<{ node: (typeof GRAPH.picked)[number]; openAt: number; closeAt: number }> = ({ node, openAt, closeAt }) => {
  const frame = useCurrentFrame();
  if (frame < openAt - 2 || frame > closeAt + 14) return null;
  const inO = interpolate(frame, [openAt, openAt + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const outO = interpolate(frame, [closeAt, closeAt + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const paragraphs = node.explanation.split(/\n\n+/).slice(0, 3);
  const codeHeight = 380;
  const codeTotal = node.snippet.lineCount * 26 + 20;
  const scroll = interpolate(frame, [openAt + 50, Math.min(closeAt - 10, openAt + 140)], [0, Math.max(0, codeTotal - codeHeight)], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.6, 1) });
  const [category, ...rest] = node.id.split("/");
  return (
    <div
      style={{
        position: "absolute",
        left: 1040,
        top: 60,
        width: 836,
        height: 975,
        borderRadius: 16,
        background: C.sub,
        border: `1px solid ${C.line}`,
        boxShadow: "0 50px 120px -40px rgba(0,0,0,0.9)",
        opacity: inO * outO,
        translate: `${(1 - inO) * 48}px 0`,
        padding: "30px 36px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", fontFamily: MONO, fontSize: 17, color: C.dim }}>
        <span>{GRAPH.project}</span>
        <span style={{ margin: "0 10px", color: C.line }}>/</span>
        <span style={{ color: C.brand }}>{category}</span>
        <span style={{ margin: "0 10px", color: C.line }}>/</span>
        <span>{rest.join("/")}</span>
        <span style={{ marginLeft: "auto", width: 36, height: 36, borderRadius: 18, border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.fg, fontSize: 20 }}>×</span>
      </div>
      <div style={{ fontFamily: SANS, fontSize: 38, fontWeight: 800, color: C.fg, letterSpacing: "-0.02em", lineHeight: 1.15 }}>{node.title}</div>
      <div style={{ fontFamily: SANS, fontSize: 21, color: C.dim, lineHeight: 1.4 }}>{node.summary}</div>
      <div style={{ fontFamily: SANS, fontSize: 19, lineHeight: 1.5, color: "rgba(232,235,240,0.85)", display: "flex", flexDirection: "column", gap: 10, maxHeight: 250, overflow: "hidden", maskImage: "linear-gradient(black 78%, transparent)", WebkitMaskImage: "linear-gradient(black 78%, transparent)" }}>
        {paragraphs.map((p, i) => (
          <p key={i} style={{ margin: 0 }}>{renderInline(p, `p${i}`)}</p>
        ))}
      </div>
      <div style={{ marginTop: "auto", borderRadius: 12, border: `1px solid ${C.line}`, background: C.bg, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderBottom: `1px solid ${C.line}`, fontFamily: MONO, fontSize: 15, color: C.dim }}>
          <span style={{ color: C.fg }}>{node.snippet.file}</span>
          <span>· lines {node.snippet.lines}</span>
          <span style={{ marginLeft: "auto", color: C.green }}>{node.snippet.lineCount} lines</span>
        </div>
        <div style={{ height: codeHeight, overflow: "hidden", position: "relative" }}>
          <div
            className="demo-code"
            style={{ padding: "10px 16px", fontFamily: MONO, fontSize: 16, lineHeight: "26px", translate: `0 ${-scroll}px` }}
            dangerouslySetInnerHTML={{ __html: node.snippet.html }}
          />
        </div>
        {node.snippet.note && (
          <div style={{ padding: "10px 16px", borderTop: `1px dashed ${C.line}`, fontFamily: SANS, fontSize: 17, color: C.dim }}>
            <span style={{ color: C.brand, fontFamily: MONO }}>note</span> {node.snippet.note}
          </div>
        )}
      </div>
    </div>
  );
};
