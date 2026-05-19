import { useEffect, useState } from "react";

export const DEFAULT_FEATURES = [
  "IKO Nordic Class 4 Shingles",
  "IKO Dynasty Class 3 Shingles",
  "IKO Cambridge Class 2 Shingles",
  "Replace Rotted or Damaged Roof Decking",
  "Back-Nail Entire Roof Deck",
  "Sealoron XT Ice & Water Barrier",
  "Generic Ice & Water Barrier",
  "Sealoron XT Roof Deck Tape",
  "Velora One Synthetic Underlayment",
  "Generic Synthetic Underlayment",
  "50-Year No-Leak Warranty",
  "5-Year Workmanship Warranty",
  "1-Year Workmanship Warranty",
];

export const FEATURES_KEY = "klaus-roofing-features-v1";

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
  // cross-tab
  try {
    window.dispatchEvent(new Event("features-updated"));
  } catch {}
}

export function loadFeatures(): string[] {
  if (typeof window === "undefined") return DEFAULT_FEATURES;
  try {
    const raw = localStorage.getItem(FEATURES_KEY);
    if (!raw) return DEFAULT_FEATURES;
    const arr = JSON.parse(raw);
    if (Array.isArray(arr) && arr.every((s) => typeof s === "string")) return arr;
  } catch {}
  return DEFAULT_FEATURES;
}

export function saveFeatures(features: string[]) {
  try {
    localStorage.setItem(FEATURES_KEY, JSON.stringify(features));
  } catch {}
  emit();
}

export function useFeatures(): [string[], (next: string[]) => void] {
  const [features, setFeatures] = useState<string[]>(DEFAULT_FEATURES);

  useEffect(() => {
    setFeatures(loadFeatures());
    const update = () => setFeatures(loadFeatures());
    listeners.add(update);
    window.addEventListener("storage", update);
    window.addEventListener("features-updated", update);
    return () => {
      listeners.delete(update);
      window.removeEventListener("storage", update);
      window.removeEventListener("features-updated", update);
    };
  }, []);

  return [features, (next) => { setFeatures(next); saveFeatures(next); }];
}
