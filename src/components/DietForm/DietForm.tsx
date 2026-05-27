"use client";
import React, { useState, useEffect } from "react";
import { useSettings } from "@/lib/context/SettingsContext";
import Card from "@/components/UI/Card";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { DietPhase } from "@/lib/types";

const PRESET_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4",
  "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280", "#14b8a6",
];

export default function DietForm() {
  const { dietPlan, updateDietPlan } = useSettings();

  const [planName, setPlanName] = useState("My 52-Week Macro Plan");
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [phases, setPhases] = useState<DietPhase[]>([
    { id: uuidv4(), name: "Lean Bulk", durationWeeks: 16, startWeek: 1, endWeek: 16, color: "#3b82f6" },
    { id: uuidv4(), name: "Mini Cut", durationWeeks: 4, startWeek: 17, endWeek: 20, color: "#ef4444" },
  ]);

  useEffect(() => {
    if (dietPlan) {
      setPlanName(dietPlan.name);
      setStartDate(dietPlan.startDate);
      setPhases(dietPlan.phases);
    }
  }, [dietPlan]);

  const handleAddPhase = () => {
    setPhases([
      ...phases,
      {
        id: uuidv4(),
        name: "New Phase",
        durationWeeks: 4,
        startWeek: 0,
        endWeek: 0,
        color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)],
      },
    ]);
  };

  const handleRemovePhase = (id: string) => {
    if (phases.length <= 1) return;
    setPhases(phases.filter((p) => p.id !== id));
  };

  const handleChangePhase = (id: string, field: keyof DietPhase, value: string | number) => {
    setPhases(phases.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const handleSave = () => {
    if (phases.some((p) => !p.name.trim() || p.durationWeeks <= 0)) {
      alert("All phases must have a name and a duration of at least 1 week.");
      return;
    }

    // Recalculate start and end weeks sequentially
    let currentWeek = 1;
    const updatedPhases = phases.map((p) => {
      const startWeek = currentWeek;
      const endWeek = currentWeek + Number(p.durationWeeks) - 1;
      currentWeek = endWeek + 1;
      return { ...p, startWeek, endWeek };
    });

    updateDietPlan({
      id: dietPlan?.id || uuidv4(),
      name: planName,
      startDate,
      phases: updatedPhases,
    });

    setPhases(updatedPhases);
    alert("Diet & Macro Plan saved successfully!");
  };

  const handleDeletePlan = () => {
    if (window.confirm("Are you sure you want to delete the entire Macro Plan?")) {
      updateDietPlan(null);
      setPlanName("My Macro Plan");
      setPhases([
        { id: uuidv4(), name: "Phase 1", durationWeeks: 4, startWeek: 1, endWeek: 4, color: "#3b82f6" },
      ]);
    }
  };

  const totalWeeks = phases.reduce((acc, p) => acc + Number(p.durationWeeks), 0);

  return (
    <Card className="max-w-2xl mx-auto space-y-8 p-6 md:p-8 mt-8 border-t-4 border-indigo-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Bulk & Cut Plan</h2>
          <p className="text-sm text-gray-400">Total duration: {totalWeeks} weeks</p>
        </div>
        {dietPlan && (
          <button
            onClick={handleDeletePlan}
            className="px-4 py-2 bg-red-900/40 text-red-400 hover:bg-red-900/60 rounded-lg text-sm font-medium transition-colors border border-red-800/50"
          >
            Delete Plan
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col space-y-1.5 flex-1">
            <label className="text-sm font-medium text-gray-300">Plan Name</label>
            <input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col space-y-1.5 flex-1">
            <label className="text-sm font-medium text-gray-300">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-medium text-gray-300">Phases</label>
          <button
            onClick={handleAddPhase}
            className="text-sm px-3 py-1 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 rounded-md transition-colors"
          >
            + Add Phase
          </button>
        </div>

        <div className="space-y-3">
          {phases.map((phase, index) => (
            <div key={phase.id} className="flex flex-wrap sm:flex-nowrap items-center bg-gray-800/40 p-2.5 rounded-xl border border-gray-700/50 gap-2">
              <div className="text-gray-400 font-bold text-xs w-6 h-6 flex items-center justify-center bg-gray-900/60 rounded flex-shrink-0">
                {index + 1}
              </div>

              <input
                type="color"
                value={phase.color}
                onChange={(e) => handleChangePhase(phase.id, "color", e.target.value)}
                className="w-8 h-8 p-0 border-0 rounded cursor-pointer bg-transparent overflow-hidden flex-shrink-0"
              />

              <input
                type="text"
                value={phase.name}
                onChange={(e) => handleChangePhase(phase.id, "name", e.target.value)}
                className="flex-1 min-w-[120px] px-3 py-1.5 bg-gray-900/30 border border-transparent hover:border-gray-600 focus:border-indigo-500 text-white focus:outline-none rounded font-medium text-sm transition-colors"
                placeholder="E.g., Lean Bulk"
              />

              <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-1.5 rounded-md border border-gray-700/50">
                <input
                  type="number"
                  min="1"
                  value={phase.durationWeeks}
                  onChange={(e) => handleChangePhase(phase.id, "durationWeeks", parseInt(e.target.value) || 1)}
                  className="w-12 bg-transparent text-white text-center focus:outline-none"
                />
                <span className="text-xs text-gray-400">weeks</span>
              </div>

              <button
                onClick={() => handleRemovePhase(phase.id)}
                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-md transition-all flex-shrink-0"
                title="Remove Phase"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-gray-700/50">
        <button
          onClick={handleSave}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-900/20 transition-all transform hover:-translate-y-0.5 text-lg"
        >
          {dietPlan ? "Update Diet Plan" : "Save Diet Plan"}
        </button>
      </div>
    </Card>
  );
}
