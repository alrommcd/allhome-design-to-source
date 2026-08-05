import type { Confidence } from "@/lib/types";

const STYLES: Record<Confidence, string> = {
  High: "border-signal-high/50 text-signal-high bg-signal-high/10",
  Medium: "border-signal-medium/50 text-signal-medium bg-signal-medium/10",
  Low: "border-signal-low/50 text-signal-low bg-signal-low/10",
};

export default function ConfidenceTag({ confidence }: { confidence: Confidence }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider ${STYLES[confidence]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {confidence} confidence
    </span>
  );
}
