// src/components/DashboardCard/DDashboardCard.tsx
"use client";
import React from "react";
import Card from "@/components/UI/Card";
import CycleBadge from "@/components/CycleBadge/CycleBadge";
import { useSettings } from "@/lib/context/SettingsContext";
import { getCycleItem, formatUI } from "@/lib/utils/cycle";
import { addDays, differenceInDays, format } from "date-fns";

export default function DashboardCard() {
  const { settings, splits } = useSettings();

  if (!settings) {
    return null; // no settings yet, nothing to display
  }

  const split = splits.find((s) => s.id === settings.splitId);
  if (!split) return null;

  const today = new Date();
  const tomorrow = addDays(today, 1);

  const todayItem = getCycleItem(today, new Date(settings.startDate), split);
  const tomorrowItem = getCycleItem(tomorrow, new Date(settings.startDate), split);

  // Find next occurrence of "Rest" if present, otherwise the next distinct item after tomorrow
  const targetLabel = split.items.includes("Rest") ? "Rest" : tomorrowItem;
  let nextTargetDate: Date | null = null;
  for (let i = 2; i < 180; i++) { // look ahead up to ~6 months
    const candidate = addDays(today, i);
    const item = getCycleItem(candidate, new Date(settings.startDate), split);
    if (item === targetLabel) {
      nextTargetDate = candidate;
      break;
    }
  }

  return (
    <Card className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-100">Today</h2>
      <div className="flex items-center space-x-2">
        <CycleBadge label={todayItem} split={split} />
      </div>

      <h2 className="text-2xl font-semibold text-gray-100 mt-4">Tomorrow</h2>
      <div className="flex items-center space-x-2">
        <CycleBadge label={tomorrowItem} split={split} />
      </div>

      {nextTargetDate && (
        <>
          <h2 className="text-2xl font-semibold text-gray-100 mt-4">
            Next {targetLabel} Day
          </h2>
          <p className="text-gray-300">
            {format(nextTargetDate, "do MMM")} ({differenceInDays(nextTargetDate, new Date())}天後)
          </p>
        </>
      )}
    </Card>
  );
}
