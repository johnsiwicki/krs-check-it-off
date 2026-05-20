import { useEffect, useMemo, useState } from "react";
import { Star, Award, CheckCircle2, RotateCcw, Calculator, X, Minus, Plus, Info } from "lucide-react";
import { useFeatures, type FeatureItem, type Tier } from "@/lib/features-store";

const TIERS: { key: Tier; label: string; icon: typeof Star; colorClass: string; tagline: string }[] = [
  { key: "best", label: "Best", icon: Star, colorClass: "bg-brand-red text-brand-red-foreground", tagline: "Maximum Protection. Maximum Peace of Mind." },
  { key: "better", label: "Better", icon: Award, colorClass: "bg-brand-dark text-brand-dark-foreground", tagline: "Strong Performance. Solid Value." },
  { key: "good", label: "Good", icon: CheckCircle2, colorClass: "bg-brand-gray text-brand-gray-foreground", tagline: "Basic Protection. Budget Friendly." },
];

const STORAGE_KEY = "klaus-roofing-comparison-v2";
const PRICE_KEY = "klaus-roofing-prices-v1";

function featureLabel(feat: FeatureItem): string {
  return typeof feat === "string" ? feat : feat.label;
}

function featureKey(feat: FeatureItem, index: number): string {
  return typeof feat === "string" ? feat : `${feat.label}--${index}`;
}

function isTierLabel(feat: FeatureItem): feat is { label: string; tiers: Record<Tier, string>; info?: Record<Tier, string> } {
  return typeof feat !== "string";
}

export default function RoofingComparison() {
  const [FEATURES] = useFeatures();
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [prices, setPrices] = useState<Record<Tier, string>>({ best: "", better: "", good: "" });
  const [calcTier, setCalcTier] = useState<Tier | null>(null);
  const [infoModal, setInfoModal] = useState<{ label: string; tierLabel: string; text: string } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setChecks(JSON.parse(raw));
      const p = localStorage.getItem(PRICE_KEY);
      if (p) setPrices(JSON.parse(p));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(checks)); } catch {}
  }, [checks]);

  useEffect(() => {
    try { localStorage.setItem(PRICE_KEY, JSON.stringify(prices)); } catch {}
  }, [prices]);

  const toggle = (row: number, tier: Tier) => {
    const k = `${row}:${tier}`;
    setChecks((p) => ({ ...p, [k]: !p[k] }));
  };

  const isChecked = (row: number, tier: Tier) => !!checks[`${row}:${tier}`];

  const setPrice = (tier: Tier, v: string) =>
    setPrices((p) => ({ ...p, [tier]: v.replace(/[^\d.]/g, "") }));

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
            onClick={() => { setChecks({}); setPrices({ best: "", better: "", good: "" }); }}
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
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
                <tr key={featureKey(feat, i)} className="border-t border-brand-red/30">
                  <td className="bg-brand-red text-brand-red-foreground font-bold text-center w-12 px-2 py-3">
                    {i + 1}
                  </td>
                  <td className="px-4 py-3 font-semibold text-sm uppercase tracking-wide bg-brand-dark text-brand-dark-foreground">
                    {featureLabel(feat)}
                  </td>
                  {TIERS.map((t) => (
                    <td key={t.key} className="text-center px-4 py-3 border-l border-brand-red/30">
                      {isTierLabel(feat) ? (
                        feat.info?.[t.key] ? (
                          <button
                            onClick={() =>
                              setInfoModal({
                                label: feat.label,
                                tierLabel: feat.tiers[t.key],
                                text: feat.info?.[t.key] ?? "",
                              })
                            }
                            className="inline-flex items-center gap-1 text-sm font-bold text-brand-red hover:underline cursor-pointer"
                          >
                            {feat.tiers[t.key]} <Info className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <span className="text-sm font-bold">{feat.tiers[t.key]}</span>
                        )
                      ) : (
                        <CheckBox checked={isChecked(i, t.key)} onClick={() => toggle(i, t.key)} />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {/* Price row */}
              <tr className="border-t-2 border-brand-red">
                <td className="bg-brand-red text-brand-red-foreground font-bold text-center px-2 py-3">$</td>
                <td className="px-4 py-3 font-bold text-sm uppercase tracking-wide bg-brand-dark text-brand-dark-foreground">
                  Total Price
                </td>
                {TIERS.map((t) => (
                  <td key={t.key} className="px-3 py-3 border-l border-brand-red/30 bg-background">
                    <PriceInput value={prices[t.key]} onChange={(v) => setPrice(t.key, v)} />
                  </td>
                ))}
              </tr>
              {/* Payment options row */}
              <tr className="border-t border-brand-red/30">
                <td colSpan={2} className="bg-background"></td>
                {TIERS.map((t) => (
                  <td key={t.key} className="px-3 py-3 border-l border-brand-red/30 bg-background text-center">
                    <button
                      onClick={() => setCalcTier(t.key)}
                      disabled={!prices[t.key]}
                      className="inline-flex items-center justify-center gap-2 w-full rounded-md bg-brand-red text-brand-red-foreground text-xs font-bold uppercase tracking-wide px-3 py-2 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                    >
                      <Calculator className="h-3.5 w-3.5" /> Payment Options
                    </button>
                  </td>
                ))}
              </tr>
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
                    <li key={featureKey(feat, i)} className="flex items-center gap-3 px-3 py-2.5">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-brand-red text-brand-red-foreground text-xs font-bold">
                        {i + 1}
                      </span>
                      <span className="flex-1 text-sm font-semibold">{featureLabel(feat)}</span>
                      {isTierLabel(feat) ? (
                        feat.info?.[t.key] ? (
                          <button
                            onClick={() =>
                              setInfoModal({
                                label: feat.label,
                                tierLabel: feat.tiers[t.key],
                                text: feat.info?.[t.key] ?? "",
                              })
                            }
                            className="inline-flex items-center gap-1 text-xs font-bold bg-brand-red/10 text-brand-red px-2 py-1 rounded hover:bg-brand-red/20 cursor-pointer"
                          >
                            {feat.tiers[t.key]} <Info className="h-3 w-3" />
                          </button>
                        ) : (
                          <span className="text-xs font-bold bg-brand-red/10 text-brand-red px-2 py-1 rounded">
                            {feat.tiers[t.key]}
                          </span>
                        )
                      ) : (
                        <CheckBox checked={isChecked(i, t.key)} onClick={() => toggle(i, t.key)} />
                      )}
                    </li>
                  ))}
                </ul>
                <div className="bg-card px-4 py-3 border-t border-border space-y-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1 block">
                      Total Price
                    </label>
                    <PriceInput value={prices[t.key]} onChange={(v) => setPrice(t.key, v)} />
                  </div>
                  <button
                    onClick={() => setCalcTier(t.key)}
                    disabled={!prices[t.key]}
                    className="inline-flex items-center justify-center gap-2 w-full rounded-md bg-brand-red text-brand-red-foreground text-sm font-bold uppercase tracking-wide px-3 py-2.5 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                  >
                    <Calculator className="h-4 w-4" /> Payment Options
                  </button>
                </div>
                <div className={`${t.colorClass} px-4 py-3 text-xs font-bold uppercase text-center`}>
                  {t.tagline}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {calcTier && (
        <PaymentCalculator
          tier={TIERS.find((t) => t.key === calcTier)!}
          price={parseFloat(prices[calcTier]) || 0}
          onClose={() => setCalcTier(null)}
        />
      )}
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

function PriceInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">$</span>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0.00"
        className="w-full rounded-md border-2 border-brand-red/40 bg-background pl-7 pr-3 py-2 text-sm font-bold text-foreground focus:outline-none focus:border-brand-red"
      />
    </div>
  );
}

function PaymentCalculator({
  tier,
  price,
  onClose,
}: {
  tier: { key: Tier; label: string; colorClass: string };
  price: number;
  onClose: () => void;
}) {
  const [downPayment, setDownPayment] = useState(0);
  const [apr, setApr] = useState(8.99);
  const [termMonths, setTermMonths] = useState(60);
  const [aprInput, setAprInput] = useState("8.99");

  const financed = Math.max(0, price - downPayment);

  const monthly = useMemo(() => {
    if (financed <= 0 || termMonths <= 0) return 0;
    const r = apr / 100 / 12;
    if (r === 0) return financed / termMonths;
    return (financed * r) / (1 - Math.pow(1 + r, -termMonths));
  }, [financed, apr, termMonths]);

  const totalPaid = monthly * termMonths + downPayment;
  const totalInterest = Math.max(0, totalPaid - price);

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

  const adjustDown = (delta: number) => {
    setDownPayment((p) => Math.max(0, Math.min(price, Math.round((p + delta) / 100) * 100)));
  };

  const adjustApr = (delta: number) => {
    setApr((p) => {
      const next = Math.max(0, Math.min(29.99, Math.round((p + delta) * 100) / 100));
      setAprInput(next.toFixed(2));
      return next;
    });
  };

  const handleAprInput = (val: string) => {
    setAprInput(val);
    const n = parseFloat(val);
    if (!isNaN(n)) {
      setApr(Math.max(0, Math.min(29.99, Math.round(n * 100) / 100)));
    }
  };

  const pct = (n: number) => Math.max(0, Math.min(price, Math.round(price * n)));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-xl border-2 border-brand-red bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`${tier.colorClass} px-5 py-4 rounded-t-lg flex items-center justify-between`}>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest opacity-80">{tier.label} Plan</div>
            <div className="text-xl font-extrabold uppercase tracking-tight">Payment Options</div>
          </div>
          <button onClick={onClose} className="p-1 hover:opacity-70 transition-opacity">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="rounded-lg bg-muted px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Total Price</span>
            <span className="text-lg font-extrabold">{fmt(price)}</span>
          </div>

          <Field label="Down Payment">
            <div className="flex items-center gap-2">
              <button
                onClick={() => adjustDown(-500)}
                className="shrink-0 h-11 w-11 rounded-lg border-2 border-brand-red/40 flex items-center justify-center hover:border-brand-red active:bg-brand-red/10 transition-colors"
                aria-label="Decrease down payment"
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base font-bold text-muted-foreground">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={downPayment ? downPayment.toLocaleString("en-US") : ""}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^\d.]/g, "");
                    const n = parseFloat(raw) || 0;
                    setDownPayment(Math.max(0, Math.min(price, n)));
                  }}
                  className="w-full h-11 rounded-lg border-2 border-brand-red/40 bg-background pl-8 pr-3 text-base font-bold text-center focus:outline-none focus:border-brand-red"
                />
              </div>
              <button
                onClick={() => adjustDown(500)}
                className="shrink-0 h-11 w-11 rounded-lg border-2 border-brand-red/40 flex items-center justify-center hover:border-brand-red active:bg-brand-red/10 transition-colors"
                aria-label="Increase down payment"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-2 mt-2">
              {[
                { label: "0%", val: pct(0) },
                { label: "10%", val: pct(0.1) },
                { label: "20%", val: pct(0.2) },
                { label: "50%", val: pct(0.5) },
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setDownPayment(opt.val)}
                  className={`flex-1 rounded-md py-1.5 text-xs font-bold uppercase border-2 transition-colors ${
                    downPayment === opt.val
                      ? "bg-brand-red border-brand-red text-brand-red-foreground"
                      : "border-brand-red/30 text-muted-foreground hover:border-brand-red hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label={`Interest Rate (APR): ${apr.toFixed(2)}%`}>
            <div className="flex items-center gap-2">
              <button
                onClick={() => adjustApr(-0.25)}
                className="shrink-0 h-11 w-11 rounded-lg border-2 border-brand-red/40 flex items-center justify-center hover:border-brand-red active:bg-brand-red/10 transition-colors"
                aria-label="Decrease APR"
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="relative flex-1">
                <input
                  type="text"
                  inputMode="decimal"
                  value={aprInput}
                  onChange={(e) => handleAprInput(e.target.value)}
                  onBlur={() => setAprInput(apr.toFixed(2))}
                  className="w-full h-11 rounded-lg border-2 border-brand-red/40 bg-background px-3 text-base font-bold text-center focus:outline-none focus:border-brand-red"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base font-bold text-muted-foreground">%</span>
              </div>
              <button
                onClick={() => adjustApr(0.25)}
                className="shrink-0 h-11 w-11 rounded-lg border-2 border-brand-red/40 flex items-center justify-center hover:border-brand-red active:bg-brand-red/10 transition-colors"
                aria-label="Increase APR"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <input
              type="range"
              min={0}
              max={29.99}
              step={0.25}
              value={apr}
              onChange={(e) => {
                const n = parseFloat(e.target.value);
                setApr(n);
                setAprInput(n.toFixed(2));
              }}
              className="w-full accent-brand-red mt-2 h-2"
            />
          </Field>

          <Field label="Term">
            <div className="grid grid-cols-4 gap-2">
              {[24, 36, 60, 120].map((m) => (
                <button
                  key={m}
                  onClick={() => setTermMonths(m)}
                  className={`rounded-lg px-2 py-3 text-sm font-bold uppercase border-2 transition-colors ${
                    termMonths === m
                      ? "bg-brand-red border-brand-red text-brand-red-foreground"
                      : "border-brand-red/40 text-foreground hover:border-brand-red"
                  }`}
                >
                  {m / 12}yr
                </button>
              ))}
            </div>
          </Field>

          <div className="rounded-lg bg-brand-dark text-brand-dark-foreground p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide opacity-80">Estimated Monthly</span>
              <span className="text-2xl font-extrabold text-brand-red">{fmt(monthly)}</span>
            </div>
            <div className="flex items-center justify-between text-xs opacity-80">
              <span>Amount Financed</span>
              <span className="font-semibold">{fmt(financed)}</span>
            </div>
            <div className="flex items-center justify-between text-xs opacity-80">
              <span>Total Interest</span>
              <span className="font-semibold">{fmt(totalInterest)}</span>
            </div>
            <div className="flex items-center justify-between text-xs opacity-80">
              <span>Total of Payments</span>
              <span className="font-semibold">{fmt(totalPaid)}</span>
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground leading-snug">
            Estimates only. Actual rates and terms depend on credit approval and lender.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block">
        {label}
      </label>
      {children}
    </div>
  );
}
