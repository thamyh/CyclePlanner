"use client";
import DashboardCard from "@/components/DashboardCard/DashboardCard";
import DietDashboardCard from "@/components/DietDashboardCard/DietDashboardCard";
import { useSettings } from "@/lib/context/SettingsContext";
import { format } from "date-fns";

export default function Home() {
  const { completedDates, toggleCompletedDate } = useSettings();

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const isTrainedToday = completedDates.includes(todayStr);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
        <DashboardCard />
        <DietDashboardCard />
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 border border-gray-700/50 flex flex-col justify-center items-center text-center">
          <h3 className="text-xl font-semibold text-gray-200 mb-2">Did you train today?</h3>
          <p className="text-gray-400 mb-6">Mark your attendance to keep track of your progress.</p>

          <button
            onClick={() => toggleCompletedDate(todayStr)}
            className={`px-8 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg ${isTrainedToday
                ? "bg-green-500/20 text-green-400 border-2 border-green-500 shadow-green-900/20"
                : "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/20"
              }`}
          >
            {isTrainedToday ? "✓ Trained!" : "Trained!"}
          </button>
        </div>
      </div>
    </div>
  );
}
