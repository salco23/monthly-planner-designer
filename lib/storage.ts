import type { PlannerSettings } from "@/lib/settings";

export type StoredPlannerState = {
  settings: PlannerSettings;
  year: number;
  month: number;
};

const STORAGE_KEY = "planner-state-v1";

export function readStoredPlannerState(): StoredPlannerState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredPlannerState;
    if (
      !parsed ||
      typeof parsed.year !== "number" ||
      typeof parsed.month !== "number" ||
      !parsed.settings
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function persistStoredPlannerState(state: StoredPlannerState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Best-effort persistence; ignore quota errors.
  }
}
