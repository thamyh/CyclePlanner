"use client";
import React from "react";
import Card from "@/components/UI/Card";
import { useSettings } from "@/lib/context/SettingsContext";
import { differenceInCalendarDays, startOfDay } from "date-fns";

export default function DietDashboardCard() {
  const { dietPlan } = useSettings();

  if (!dietPlan || !dietPlan.phases || dietPlan.phases.length === 0) {
    return null;
  }

  const today = startOfDay(new Date());
  const startDate = startOfDay(new Date(dietPlan.startDate));
  
  const daysDiff = differenceInCalendarDays(today, startDate);
  
  const totalWeeks = dietPlan.phases.reduce((acc, p) => acc + Number(p.durationWeeks), 0);
  
  // Calculate current week (1-indexed). If daysDiff is negative, it hasn't started.
  const currentWeek = daysDiff >= 0 ? Math.floor(daysDiff / 7) + 1 : 0;

  let content = null;

  if (currentWeek < 1) {
    content = (
      <div>
        <h2 className="text-2xl font-semibold text-gray-100">Macro Plan</h2>
        <p className="text-gray-400 mt-1">Starting in {Math.abs(daysDiff)} days</p>
      </div>
    );
  } else if (currentWeek > totalWeeks) {
    content = (
      <div>
        <h2 className="text-2xl font-semibold text-green-400">Macro Plan Completed!</h2>
        <p className="text-gray-400 mt-1">You have finished all {totalWeeks} weeks.</p>
      </div>
    );
  } else {
    // Find active phase
    const activePhase = dietPlan.phases.find(
      (p) => currentWeek >= p.startWeek && currentWeek <= p.endWeek
    );

    if (activePhase) {
      const weekInPhase = currentWeek - activePhase.startWeek + 1;
      content = (
        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-2xl font-semibold text-white tracking-tight">Macro Phase</h2>
              <span 
                className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: activePhase.color }}
              >
                {activePhase.name}
              </span>
            </div>
            
            <p className="text-gray-300 text-lg font-medium">
              Week <span className="text-indigo-400 font-bold">{weekInPhase}</span> of {activePhase.durationWeeks}
            </p>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Overall Progress</span>
              <span>Week {currentWeek} / {totalWeeks}</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, (currentWeek / totalWeeks) * 100))}%` }}
              ></div>
            </div>
          </div>
        </div>
      );
    } else {
      // Fallback if phase not found (should not happen if math is correct)
      content = (
        <div>
          <h2 className="text-2xl font-semibold text-gray-100">Macro Plan</h2>
          <p className="text-gray-400 mt-1">Week {currentWeek} / {totalWeeks}</p>
        </div>
      );
    }
  }

  return (
    <Card className="h-full">
      {content}
    </Card>
  );
}
