import { useEffect, useState } from "react";
import { Star, Award, CheckCircle2, RotateCcw } from "lucide-react";

type Tier = "best" | "better" | "good";

const FEATURES = [
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

const TIERS: { key: Tier; label: string; icon: typeof Star; colorClass: string; tagline: string }[] = [
  { key: "best", label: "Best", icon: Star, colorClass: "bg-brand-red text-brand-red-foreground", tagline: "Maximum Protection. Maximum Peace of Mind." },
  { key: "better", label: "Better", icon: Award, colorClass: "bg-brand-dark text-brand-dark-foreground", tagline: "Strong Performance. Solid Value." },
  { key: "good", label: "Good", icon: CheckCircle2, colorClass: "bg-brand-gray text-brand-gray-foreground", tagline: "Basic Protection. Budget Friendly." },
];

const STORAGE_KEY = "klaus-roofing-comparison-v1";

export default function RoofingComparison() {
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setChecks(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(checks)); } catch {}
  }, [checks]);

  const toggle = (row: number, tier: Tier) => {
    const k = `${row}:${tier}`;
    setChecks((p) => ({ ...p, [k]: !p[k] }));
  };

  const isChecked = (row: number, tier: Tier) => !!checks[`${row}:${tier}`];

  return (
    <div className="min-h-screen bg-background py-6 px-3 sm:py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <div className="text-brand-red font-extrabold text-2xl sm:text-3xl tracking-tight leading-none">
              KLAUS ROOFING
            </div>
            <div className="text-xs font-semibold tracking-[0.3em] text-foreground">SYSTEMS</div>
          </div>
          <div className="text-center sm:text-right">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              ROOFING SYSTEM <span className="text-brand-red">COMPARISON</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Compare features. Choose the protection that's right for you.
            </p>
          </div>
        </header>

        {/* Reset */}
        <div className="flex justify-end mb-3">
          <button
            onClick={() => setChecks({})}
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset selections
          </button>
        </div>

        {/* Desktop / tablet table */}
        <div className="hidden md:block overflow-hidden rounded-xl border-2 border-brand-red">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-background w-16"></th>
                <th className="bg-background text-left"></th>
                {TIERS.map((t) => {
                  const Icon = t.icon;
                  return (
                    <th key={t.key} className={`${t.colorClass} px-4 py-4 text-center`}>
                      <div className="flex items-center justify-center gap-2 text-lg font-extrabold uppercase tracking-wide">
                        <Icon className="h-6 w-6" fill="currentColor" strokeWidth={0} />
                        {t.label}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((feat, i) => (
                <tr key={feat} className="border-t border-brand-red/30">
                  <td className="bg-brand-red text-brand-red-foreground font-bold text-center w-12 px-2 py-3">
                    {i + 1}
                  </td>
                  <td className={`px-4 py-3 font-semibold text-sm uppercase tracking-wide ${i % 2 === 0 ? "bg-brand-dark text-brand-dark-foreground" : "bg-brand-dark/90 text-brand-dark-foreground"}`}>
                    {feat}
                  </td>
                  {TIERS.map((t) => (
                    <td key={t.key} className="text-center px-4 py-3 border-l border-brand-red/30">
                      <CheckBox checked={isChecked(i, t.key)} onClick={() => toggle(i, t.key)} />
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td colSpan={2} className="bg-background"></td>
                {TIERS.map((t) => {
                  const Icon = t.icon;
                  return (
                    <td key={t.key} className={`${t.colorClass} px-3 py-4 text-center align-middle border-l border-brand-red/30`}>
                      <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase">
                        <Icon className="h-5 w-5 shrink-0" fill="currentColor" strokeWidth={0} />
                        <span className="leading-tight text-left">{t.tagline}</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile: stacked tier cards */}
        <div className="md:hidden space-y-4">
          {TIERS.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.key} className="rounded-xl overflow-hidden border-2 border-brand-red">
                <div className={`${t.colorClass} px-4 py-3 flex items-center gap-2`}>
                  <Icon className="h-5 w-5" fill="currentColor" strokeWidth={0} />
                  <span className="text-lg font-extrabold uppercase tracking-wide">{t.label}</span>
                </div>
                <ul className="divide-y divide-border bg-card">
                  {FEATURES.map((feat, i) => (
                    <li key={feat} className="flex items-center gap-3 px-3 py-2.5">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-brand-red text-brand-red-foreground text-xs font-bold">
                        {i + 1}
                      </span>
                      <span className="flex-1 text-sm font-semibold">{feat}</span>
                      <CheckBox checked={isChecked(i, t.key)} onClick={() => toggle(i, t.key)} />
                    </li>
                  ))}
                </ul>
                <div className={`${t.colorClass} px-4 py-3 text-xs font-bold uppercase text-center`}>
                  {t.tagline}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CheckBox({ checked, onClick }: { checked: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={checked}
      className={`inline-flex h-6 w-6 items-center justify-center rounded border-2 transition-colors ${
        checked
          ? "bg-brand-red border-brand-red text-brand-red-foreground"
          : "bg-background border-brand-red/70 hover:border-brand-red"
      }`}
    >
      {checked && (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  );
}
