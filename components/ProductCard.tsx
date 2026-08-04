import type { MatchResult, Product } from "@/lib/types";
import ConfidenceTag from "./ConfidenceTag";
import ProductImage from "./ProductImage";

interface ProductCardProps {
  product: Product;
  match: MatchResult;
  selected: boolean;
  onSelect: () => void;
}

export default function ProductCard({ product, match, selected, onSelect }: ProductCardProps) {
  const soft = match.confidence !== "High";

  return (
    <div
      className={`corner-brackets flex flex-col gap-3 border p-4 transition-colors ${
        selected ? "border-brass bg-brass/5" : "border-ink-line bg-ink-panel"
      } ${soft ? "opacity-90" : ""}`}
    >
      {soft && (
        <p className="font-mono text-[10px] uppercase tracking-widest text-stone">Closest available match</p>
      )}

      <ProductImage product={product} />

      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-brass">{product.brand}</p>
          <h3 className="font-display text-base font-medium leading-snug text-stone-light">{product.productLine}</h3>
        </div>
        <ConfidenceTag confidence={match.confidence} />
      </div>

      <p className="text-sm leading-relaxed text-stone">{match.rationale}</p>

      <div className="flex items-center justify-between border-t border-ink-line pt-3">
        <span className="font-mono text-sm text-stone-light">
          ₹{product.priceRangeINR[0].toLocaleString("en-IN")} – ₹{product.priceRangeINR[1].toLocaleString("en-IN")}
          <span className="ml-1.5 text-[10px] uppercase tracking-wider text-stone/60">est.</span>
        </span>
        <button
          onClick={onSelect}
          className={`border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
            selected
              ? "border-brass bg-brass text-ink"
              : "border-ink-line text-stone-light hover:border-brass hover:text-brass"
          }`}
        >
          {selected ? "Selected" : "Select"}
        </button>
      </div>
    </div>
  );
}
