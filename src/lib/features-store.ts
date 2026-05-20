import { useEffect, useState } from "react";

export type Tier = "best" | "better" | "good";
export type TierFeature = {
  label: string;
  tiers: Record<Tier, string>;
  info?: Record<Tier, string>;
};
export type CheckFeature = {
  label: string;
  defaults: Record<Tier, boolean>;
};
export type FeatureItem = string | TierFeature | CheckFeature;

export const DEFAULT_FEATURES: FeatureItem[] = [
  {
    label: "Shingles",
    tiers: { best: "Class 4", better: "Class 3", good: "Class 2" },
    info: {
      best: "The highest impact resistance rating available. Class 4 shingles withstand hail up to 2 inches in diameter and simulated impacts from 20 feet. Many insurers offer premium discounts. Maximum protection for severe weather.",
      better: "Strong impact resistance that handles moderate hail and debris. Class 3 shingles pass rigorous testing with impacts from 17 feet. Excellent protection for most climates — a smart balance of performance and value.",
      good: "Standard impact resistance that meets code requirements. Class 2 shingles handle smaller hail and typical weather reliably. A solid, budget-friendly choice for homeowners who need dependable basic protection.",
    },
  },
  { label: "Replace Rotted or Damaged Roof Decking", defaults: { best: true, better: true, good: true } },
  { label: "Back-Nail Entire Roof Deck", defaults: { best: true, better: false, good: false } },
  { label: "Sealoron XT Ice & Water Barrier", defaults: { best: true, better: false, good: false } },
  { label: "Generic Ice & Water Barrier", defaults: { best: false, better: true, good: true } },
  { label: "Sealoron XT Roof Deck Tape", defaults: { best: true, better: false, good: false } },
  { label: "Velora One Synthetic Underlayment", defaults: { best: true, better: true, good: false } },
  { label: "Generic Synthetic Underlayment", defaults: { best: false, better: false, good: true } },
  { label: "Warranty", tiers: { best: "50 Year", better: "5 Year", good: "1 Year" } },
];

export const FEATURES_KEY = "klaus-roofing-features-v4";

function isTierFeature(v: unknown): v is TierFeature {
  if (typeof v !== "object" || v === null) return false;
  const obj = v as Record<string, unknown>;
  if (typeof obj.label !== "string") return false;
  if (typeof obj.tiers !== "object" || obj.tiers === null) return false;
  const tiers = obj.tiers as Record<string, unknown>;
  if (
    typeof tiers.best !== "string" ||
    typeof tiers.better !== "string" ||
    typeof tiers.good !== "string"
  )
    return false;
  if (obj.info !== undefined) {
    if (typeof obj.info !== "object" || obj.info === null) return false;
    const info = obj.info as Record<string, unknown>;
    if (
      typeof info.best !== "string" ||
      typeof info.better !== "string" ||
      typeof info.good !== "string"
    )
      return false;
  }
  return true;
}

function isCheckFeature(v: unknown): v is CheckFeature {
  if (typeof v !== "object" || v === null) return false;
  const obj = v as Record<string, unknown>;
  if (typeof obj.label !== "string") return false;
  if (typeof obj.defaults !== "object" || obj.defaults === null) return false;
  const d = obj.defaults as Record<string, unknown>;
  return typeof d.best === "boolean" && typeof d.better === "boolean" && typeof d.good === "boolean";
}

function isFeatureItem(v: unknown): v is FeatureItem {
  if (typeof v === "string") return true;
  return isTierFeature(v) || isCheckFeature(v);
}

export function isTierLabelFeature(feat: FeatureItem): feat is TierFeature {
  return typeof feat !== "string" && "tiers" in feat;
}

export function getFeatureDefault(feat: FeatureItem, tier: Tier): boolean {
  if (typeof feat === "string") return false;
  if (isTierLabelFeature(feat)) return false;
  return feat.defaults[tier];
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
