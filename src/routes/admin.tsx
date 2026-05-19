import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, GripVertical, Plus, RotateCcw, Trash2 } from "lucide-react";
import { DEFAULT_FEATURES, loadFeatures, saveFeatures, type FeatureItem, type Tier } from "@/lib/features-store";

const TIERS: Tier[] = ["best", "better", "good"];

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Manage Features" },
      { name: "description", content: "Manage the roofing comparison feature list." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setFeatures(loadFeatures()); }, []);

  const update = (next: FeatureItem[]) => {
    setFeatures(next);
    saveFeatures(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1200);
  };

  const setItem = (i: number, v: FeatureItem) => {
    const next = [...features]; next[i] = v; update(next);
  };
  const remove = (i: number) => update(features.filter((_, idx) => idx !== i));
  const add = () => update([...features, "New feature"]);
  const reset = () => {
    if (confirm("Reset features to the default list?")) update([...DEFAULT_FEATURES]);
  };

  const onDragStart = (i: number) => setDragIdx(i);
  const onDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === i) return;
    const next = [...features];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(i, 0, moved);
    setDragIdx(i);
    setFeatures(next);
  };
  const onDragEnd = () => { if (dragIdx !== null) { saveFeatures(features); setDragIdx(null); } };

  return (
    <div className="min-h-screen bg-background py-6 px-3 sm:py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-2">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to comparison
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              MANAGE <span className="text-brand-red">FEATURES</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Edit, reorder, add, or remove items shown in the comparison chart.
            </p>
          </div>
          <div className="text-xs font-bold text-brand-red opacity-0 transition-opacity" style={{ opacity: saved ? 1 : 0 }}>
            Saved
          </div>
        </div>

        <div className="rounded-xl border-2 border-brand-red overflow-hidden">
          <div className="bg-brand-dark text-brand-dark-foreground px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wide">Feature List ({features.length})</span>
            <div className="flex gap-2">
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 text-xs font-semibold opacity-80 hover:opacity-100 transition-opacity"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>
          </div>

          <ul className="divide-y divide-border bg-card">
            {features.map((feat, i) => (
              <li
                key={i}
                draggable
                onDragStart={() => onDragStart(i)}
                onDragOver={(e) => onDragOver(e, i)}
                onDragEnd={onDragEnd}
                className={`px-3 py-3 ${dragIdx === i ? "opacity-50" : ""}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="cursor-grab text-muted-foreground hover:text-foreground touch-none">
                    <GripVertical className="h-4 w-4" />
                  </span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-brand-red text-brand-red-foreground text-xs font-bold">
                    {i + 1}
                  </span>
                  <button
                    onClick={() => remove(i)}
                    aria-label="Remove"
                    className="ml-auto p-2 text-muted-foreground hover:text-brand-red transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {typeof feat === "string" ? (
                  <input
                    type="text"
                    value={feat}
                    onChange={(e) => setItem(i, e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold focus:outline-none focus:border-brand-red"
                  />
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={feat.label}
                      onChange={(e) => setItem(i, { ...feat, label: e.target.value })}
                      placeholder="Feature label"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold focus:outline-none focus:border-brand-red"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      {TIERS.map((tier) => (
                        <div key={tier}>
                          <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-0.5 block">
                            {tier}
                          </label>
                          <input
                            type="text"
                            value={feat.tiers[tier]}
                            onChange={(e) =>
                              setItem(i, { ...feat, tiers: { ...feat.tiers, [tier]: e.target.value } })
                            }
                            className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs font-semibold focus:outline-none focus:border-brand-red"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
            {features.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-muted-foreground">
                No features yet. Add one below.
              </li>
            )}
          </ul>

          <div className="bg-card px-3 py-3 border-t border-border">
            <button
              onClick={add}
              className="inline-flex items-center justify-center gap-2 w-full rounded-md bg-brand-red text-brand-red-foreground text-sm font-bold uppercase tracking-wide px-3 py-2.5 hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4" /> Add Feature
            </button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Changes save automatically and appear in the comparison chart immediately.
        </p>
      </div>
    </div>
  );
}
