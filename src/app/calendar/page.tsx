"use client";
import React from "react";
import PlannerCalendar from "@/components/PlannerCalendar/PlannerCalendar";
import { useSettings } from "@/lib/context/SettingsContext";


import { exportToCSV, exportToICS } from "@/lib/utils/export";

export default function CalendarPage() {
  const { events } = useSettings();

  const handleExportCSV = () => {
    if (events.length === 0) return alert("No events to export. Please configure a split first.");
    exportToCSV(events);
  };

  const handleExportICS = () => {
    if (events.length === 0) return alert("No events to export. Please configure a split first.");
    exportToICS(events);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-white">Calendar</h1>
        <div className="flex space-x-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors border border-gray-600"
          >
            Export CSV
          </button>
          <button
            onClick={handleExportICS}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors border border-blue-500"
          >
            Export ICS
          </button>
        </div>
      </div>
      
      <PlannerCalendar />
    </div>
  );
}
