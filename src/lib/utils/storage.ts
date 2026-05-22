// src/lib/utils/storage.ts
import localforage from "localforage";
import { Split, Settings, DietPlan } from "../types";

const SPLITS_KEY = "planner_splits";
const SETTINGS_KEY = "planner_settings";
const COMPLETED_DATES_KEY = "planner_completed_dates";
const DIET_PLAN_KEY = "planner_diet_plan";

// Configure localforage
localforage.config({
  name: "CyclePlannerDB",
  storeName: "planner_store", // Should be alphanumeric, with underscores.
  description: "Local storage for Cycle Planner App"
});

export const saveSplits = async (splits: Split[]) => {
  await localforage.setItem(SPLITS_KEY, splits);
};

export const loadSplits = async (): Promise<Split[]> => {
  const data = await localforage.getItem<Split[]>(SPLITS_KEY);
  return data ? data : [];
};

export const saveSettings = async (settings: Settings) => {
  await localforage.setItem(SETTINGS_KEY, settings);
};

export const loadSettings = async (): Promise<Settings | null> => {
  const data = await localforage.getItem<Settings>(SETTINGS_KEY);
  return data ? data : null;
};

export const saveCompletedDates = async (dates: string[]) => {
  await localforage.setItem(COMPLETED_DATES_KEY, dates);
};

export const loadCompletedDates = async (): Promise<string[]> => {
  const data = await localforage.getItem<string[]>(COMPLETED_DATES_KEY);
  return data ? data : [];
};

export const saveDietPlan = async (plan: DietPlan | null) => {
  if (plan) {
    await localforage.setItem(DIET_PLAN_KEY, plan);
  } else {
    await localforage.removeItem(DIET_PLAN_KEY);
  }
};

export const loadDietPlan = async (): Promise<DietPlan | null> => {
  const data = await localforage.getItem<DietPlan>(DIET_PLAN_KEY);
  return data ? data : null;
};
