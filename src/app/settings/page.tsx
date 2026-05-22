"use client";
import { useState } from "react";
import SplitForm from "@/components/SplitForm/SplitForm";
import DietForm from "@/components/DietForm/DietForm";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"cycle" | "diet">("cycle");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-6">
        <button
          className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'cycle' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
          onClick={() => setActiveTab('cycle')}
        >
          Cycle Sequence
        </button>
        <button
          className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'diet' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
          onClick={() => setActiveTab('diet')}
        >
          Diet & Macro Plan
        </button>
      </div>

      {/* Content */}
      {activeTab === "cycle" && <SplitForm />}
      {activeTab === "diet" && (
        <div className="mt-4">
          <DietForm />
        </div>
      )}
    </div>
  );
}
