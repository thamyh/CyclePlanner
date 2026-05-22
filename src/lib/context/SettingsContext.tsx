// src/lib/context/SettingsContext.tsx
"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { Split, Settings, PlannerEvent, DietPlan } from "../types";
import { loadSplits, loadSettings, saveSplits, saveSettings, loadCompletedDates, saveCompletedDates, loadDietPlan, saveDietPlan } from "../utils/storage";
import { generateEvents } from "../utils/cycle";

interface SettingsContextProps {
  splits: Split[];
  settings: Settings | null;
  events: PlannerEvent[];
  completedDates: string[];
  dietPlan: DietPlan | null;
  addSplit: (split: Split) => void;
  updateSplit: (updated: Split) => void;
  deleteSplit: (id: string) => void;
  setSettings: (newSettings: Settings) => void;
  toggleCompletedDate: (dateStr: string) => void;
  updateDietPlan: (plan: DietPlan | null) => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [splits, setSplits] = useState<Split[]>([]);
  const [settings, setSettingsState] = useState<Settings | null>(null);
  const [events, setEvents] = useState<PlannerEvent[]>([]);
  const [completedDates, setCompletedDates] = useState<string[]>([]);
  const [dietPlan, setDietPlanState] = useState<DietPlan | null>(null);

  // Load persisted data on mount
  useEffect(() => {
    let mounted = true;
    const initStorage = async () => {
      const storedSplits = await loadSplits();
      const storedSettings = await loadSettings();
      const storedCompleted = await loadCompletedDates();
      const storedDietPlan = await loadDietPlan();
      
      if (mounted) {
        setSplits(storedSplits);
        setSettingsState(storedSettings);
        setCompletedDates(storedCompleted);
        setDietPlanState(storedDietPlan);
      }
    };
    initStorage();
    return () => { mounted = false; };
  }, []);

  // Re‑generate events whenever split or settings change
  useEffect(() => {
    if (settings && splits.length) {
      const currentSplit = splits.find((s) => s.id === settings.splitId);
      if (currentSplit) {
        const ev = generateEvents(currentSplit, settings);
        setEvents(ev);
      }
    } else {
      setEvents([]);
    }
  }, [settings, splits]);

  // Persist splits when they change
  useEffect(() => {
    saveSplits(splits);
  }, [splits]);

  // Persist settings when they change
  useEffect(() => {
    if (settings) {
      saveSettings(settings);
    }
  }, [settings]);

  useEffect(() => {
    saveCompletedDates(completedDates);
  }, [completedDates]);

  useEffect(() => {
    saveDietPlan(dietPlan);
  }, [dietPlan]);

  const addSplit = (newSplit: Split) => {
    setSplits((prev) => [...prev, newSplit]);
  };

  const updateSplit = (updated: Split) => {
    setSplits((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const deleteSplit = (id: string) => {
    setSplits((prev) => prev.filter((s) => s.id !== id));
    // if the current settings reference the deleted split, clear settings
    if (settings?.splitId === id) {
      setSettingsState(null);
    }
  };

  const setSettings = (newSettings: Settings) => {
    setSettingsState(newSettings);
  };

  const toggleCompletedDate = (dateStr: string) => {
    setCompletedDates((prev) => 
      prev.includes(dateStr) 
        ? prev.filter((d) => d !== dateStr)
        : [...prev, dateStr]
    );
  };

  const updateDietPlan = (plan: DietPlan | null) => {
    setDietPlanState(plan);
  };

  return (
    <SettingsContext.Provider
      value={{ splits, settings, events, completedDates, dietPlan, addSplit, updateSplit, deleteSplit, setSettings, toggleCompletedDate, updateDietPlan }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return ctx;
};
