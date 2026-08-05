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
      className={`flex flex-col gap-3 rounded-xl border p-5 transition-colors ${
        selected ? "border-brass bg-brass/[0.06]" : "border-paper-line bg-paper-surface"
      } ${soft ? "opacity-95" : ""}`}
    >
      {soft && (
        <p className="font-body text-[10px] uppercase tracking-[0.15em] text-muted">Closest available match</p>
      )}

      <ProductImage product={product} />

      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-body text-[11px] uppercase tracking-wider text-brass">{product.brand}</p>
          <h3 className="font-display text-base font-medium leading-snug text-charcoal">{product.productLine}</h3>
        </div>
        <ConfidenceTag confidence={match.confidence} />
      </div>

      {/* Physical description always renders, regardless of image status - never hidden when there's no photo. */}
      <p className="font-body text-xs leading-relaxed text-muted">{product.description}</p>

      <p className="text-sm leading-relaxed text-charcoal/85">{match.rationale}</p>

      <div className="flex justify-end border-t border-paper-line pt-3">
        <button
          onClick={onSelect}
          className={`rounded-full border px-4 py-1.5 font-body text-xs font-medium uppercase tracking-wider transition-colors ${
            selected
              ? "border-brass bg-brass text-charcoal"
              : "border-brass/50 text-brass hover:border-brass hover:bg-brass/10"
          }`}
        >
          {selected ? "Added" : "Add to Quotation"}
        </button>
      </div>
    </div>
  );
}
