// src/lib/utils/export.ts
import { PlannerEvent } from "../types";
import { format } from "date-fns";

/** Export events as CSV */
export const exportToCSV = (events: PlannerEvent[]) => {
  const header = "Date,Item,Color\n";
  const rows = events
    .map(e => `${format(new Date(e.start), "dd-MM")},${e.title},${e.backgroundColor}`)
    .join("\n");
  downloadFile("schedule.csv", header + rows, "text/csv");
};

/** Export events as iCal (ICS) */
export const exportToICS = (events: PlannerEvent[]) => {
  const uidBase = Date.now();
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CyclePlanner//EN",
  ];
  events.forEach((e, i) => {
    const ymd = e.start.replace(/-/g, "");
    lines.push(
      "BEGIN:VEVENT",
      `UID:${uidBase}-${i}@cycleplanner`,
      `DTSTART;VALUE=DATE:${ymd}`,
      `DTEND;VALUE=DATE:${ymd}`,
      `SUMMARY:${e.title}`,
      "END:VEVENT"
    );
  });
  lines.push("END:VCALENDAR");
  downloadFile("schedule.ics", lines.join("\r\n"), "text/calendar");
};

/** Helper to trigger a browser download */
function downloadFile(name: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
