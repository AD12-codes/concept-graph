import { GRAPH } from "@/data/graph";

export const CX = 960;
export const CY = 575;
export const RING = 340;
export const CHILD_R = 185;

/** Put the three categories the demo clicks on the left, so the dialog on the right never covers them. */
const ORDER = [
  "auth", "database", "api-design", "communication", "networking", "system-design", "ui-components", "testing",
  "devops", "rate-limiting", "security", "state-management", "tooling", "programming-languages",
];

export const CATEGORIES = ORDER.map((id) => GRAPH.categories.find((c) => c.id === id)!).filter(Boolean);

export function categoryAngle(index: number): number {
  return ((-90 + (index * 360) / CATEGORIES.length) * Math.PI) / 180;
}

export function categoryPos(index: number) {
  const a = categoryAngle(index);
  return { x: CX + RING * Math.cos(a), y: CY + RING * Math.sin(a) };
}

export function childPos(categoryIndex: number, childIndex: number, count: number) {
  const base = categoryAngle(categoryIndex);
  const spread = (26 * Math.PI) / 180;
  const a = base + (childIndex - (count - 1) / 2) * spread;
  const c = categoryPos(categoryIndex);
  return { x: c.x + CHILD_R * Math.cos(a), y: c.y + CHILD_R * Math.sin(a) };
}

export function categoryIndex(id: string) {
  return CATEGORIES.findIndex((c) => c.id === id);
}

export function childIndex(categoryId: string, nodeId: string) {
  const cat = CATEGORIES[categoryIndex(categoryId)];
  return cat.nodes.findIndex((n) => n.id === nodeId);
}
