import { useSyncExternalStore } from "react";
import { seedOperations, type OperationsState } from "./model";
const KEY = "provider-operations-demo-v1";
let cached: OperationsState | undefined;
const listeners = new Set<() => void>();
export function snapshot(): OperationsState {
  if (!cached) {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      cached =
        parsed &&
        ["invoices", "workers", "bills", "tasks", "reviews", "audit"].every(
          (key) => Array.isArray(parsed[key]),
        ) &&
        parsed.matches
          ? parsed
          : seedOperations();
    } catch {
      cached = seedOperations();
    }
  }
  return cached!;
}
export function updateOperations(
  action: string,
  change: (state: OperationsState) => OperationsState,
) {
  const state = snapshot();
  const next = change(state);
  const updated = {
    ...next,
    audit: [
      { id: crypto.randomUUID(), at: new Date().toISOString(), action },
      ...state.audit,
    ].slice(0, 200),
  };
  localStorage.setItem(KEY, JSON.stringify(updated));
  cached = updated;
  listeners.forEach((listener) => listener());
}
export function useOperations() {
  return useSyncExternalStore((listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, snapshot);
}
window.addEventListener("storage", (event) => {
  if (event.key === KEY || event.key === null) {
    cached = undefined;
    listeners.forEach((listener) => listener());
  }
});
