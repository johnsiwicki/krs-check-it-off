import { useEffect, useState } from "react";

export type Tier = "best" | "better" | "good";
export type FeatureItem =
  | string
  | { label: string; tiers: Record<Tier, string> };

export const DEFAULT_FEATURES: FeatureItem[] = [
  { label: "Shingles", tiers: { best: "Class 4", better: "Class 3", good: "Class 2" } },
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

function isFeatureItem(v: unknown): v is FeatureItem {
  if (typeof v === "string") return true;
  if (typeof v !== "object" || v === null) return false;
  const obj = v as Record<string, unknown>;
  if (typeof obj.label !== "string") return false;
  if (typeof obj.tiers !== "object" || obj.tiers === null) return false;
  const tiers = obj.tiers as Record<string, unknown>;
  return (
    typeof tiers.best === "string" &&
    typeof tiers.better === "string" &&
    typeof tiers.good === "string"
  );
}

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
  try {
    window.dispatchEvent(new Event("features-updated"));
  } catch {}
}

export function loadFeatures(): FeatureItem[] {
  if (typeof window === "undefined") return DEFAULT_FEATURES;
  try {
    const raw = localStorage.getItem(FEATURES_KEY);
    if (!raw) return DEFAULT_FEATURES;
    const arr = JSON.parse(raw);
    if (Array.isArray(arr) && arr.every(isFeatureItem)) return arr;
  } catch {}
  return DEFAULT_FEATURES;
}

export function saveFeatures(features: FeatureItem[]) {
  try {
    localStorage.setItem(FEATURES_KEY, JSON.stringify(features));
  } catch {}
  emit();
}

export function useFeatures(): [FeatureItem[], (next: FeatureItem[]) => void] {
  const [features, setFeatures] = useState<FeatureItem[]>(DEFAULT_FEATURES);

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
