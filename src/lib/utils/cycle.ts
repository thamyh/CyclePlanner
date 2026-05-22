// src/lib/utils/cycle.ts
import { differenceInCalendarDays, addDays, format } from "date-fns";
import { Split, Settings, PlannerEvent } from "../types";

/**
 * Return the cycle item for a given date based on the start date and split.
 * Works with any length of cycle.
 */
export const getCycleItem = (
  date: Date,
  startDate: Date,
  split: Split
): string => {
  const dayDiff = differenceInCalendarDays(date, startDate);
  const idx = ((dayDiff % split.items.length) + split.items.length) % split.items.length;
  return split.items[idx];
};

/**
 * Generate planner events for the next `months` months (default 6).
 * Dates are stored as ISO strings (yyyy-MM-dd) for FullCalendar.
 */
export const generateEvents = (
  split: Split,
  settings: Settings,
  months: number = 6
): PlannerEvent[] => {
  const start = new Date(settings.startDate);
  const totalDays = months * 30; // approximate; FullCalendar will trim to month view
  const events: PlannerEvent[] = [];

  const defaultPalette: Record<string, string> = {
    Push: "hsl(0, 70%, 55%)",
    Pull: "hsl(220, 70%, 55%)",
    Legs: "hsl(120, 70%, 45%)",
    Rest: "hsl(0, 0%, 45%)",
  };

  for (let i = 0; i <= totalDays; i++) {
    const cur = addDays(start, i);
    const title = getCycleItem(cur, start, split);
    const color = split.colors?.[title] ?? defaultPalette[title] ?? "#888888";

    events.push({
      id: `${i}`,
      title,
      start: cur.toISOString().split("T")[0],
      backgroundColor: color,
    });
  }

  return events;
};

/**
 * Helper to format a date for UI (DD-MM)
 */
export const formatUI = (date: Date): string => format(date, "dd-MM");
