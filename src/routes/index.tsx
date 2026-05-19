import { createFileRoute } from "@tanstack/react-router";
import RoofingComparison from "@/components/RoofingComparison";

export const Route = createFileRoute("/")({
  component: RoofingComparison,
  head: () => ({
    meta: [
      { title: "Klaus Roofing Systems — Roofing System Comparison" },
      { name: "description", content: "Compare Klaus Roofing System tiers — Best, Better, Good. Check off features to build your roof." },
    ],
  }),
});
