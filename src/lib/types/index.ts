// src/lib/types/index.ts
export interface Split {
  id: string; // uuid
  name: string;
  items: string[]; // e.g. ["Push","Pull","Legs","Rest"]
  colors?: Record<string, string>; // optional custom colors per item (hex)
}

export interface Settings {
  splitId: string; // selected split id
  startDate: string; // ISO yyyy-MM-dd
  startItem: string; // item name that matches startDate
}

export interface PlannerEvent {
  id: string;
  title: string; // cycle item name
  start: string; // ISO yyyy-MM-dd (all‑day)
  backgroundColor: string; // hex or hsl
}

export interface DietPhase {
  id: string; // uuid
  name: string; // e.g., "Lean Bulk"
  durationWeeks: number; // e.g., 16
  startWeek: number; // 1-indexed, calculated
  endWeek: number; // 1-indexed, calculated
  color: string; // hex for calendar dot
}

export interface DietPlan {
  id: string; // uuid
  name: string;
  startDate: string; // ISO yyyy-MM-dd
  phases: DietPhase[];
}
