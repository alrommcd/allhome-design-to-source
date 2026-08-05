import { getProductById } from "@/lib/catalog";
import { CATEGORY_LABELS, type Category, type MatchResult } from "@/lib/types";
import ProductCard from "./ProductCard";

export interface CategoryResult {
  category: Category;
  matches: MatchResult[];
  error: string | null;
}

export interface CrossSellItem {
  category: Category;
  match: MatchResult;
}

interface ResultsPanelProps {
  analyzedCategories: Category[];
  pendingCategories: Set<Category>;
  results: CategoryResult[];
  crossSellPending: boolean;
  crossSell: CrossSellItem[];
  selectedProducts: Partial<Record<Category, string>>;
  onSelectProduct: (category: Category, productId: string) => void;
}

function SkeletonCards({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-64 animate-pulse rounded-xl border border-paper-line bg-paper-surface" />
      ))}
    </div>
  );
}

export default function ResultsPanel({
  analyzedCategories,
  pendingCategories,
  results,
  crossSellPending,
  crossSell,
  selectedProducts,
  onSelectProduct,
}: ResultsPanelProps) {
  return (
    <div className="flex flex-col gap-10">
      {analyzedCategories.map((category) => {
        const isPending = pendingCategories.has(category);
        const result = results.find((r) => r.category === category);

        return (
          <div key={category}>
            <p className="mb-3 font-body text-xs uppercase tracking-[0.15em] text-brass">
              {CATEGORY_LABELS[category]}
            </p>

            {isPending && <SkeletonCards count={2} />}

            {!isPending && result?.error && (
              <p className="rounded-xl border border-signal-low/30 bg-signal-low/[0.06] p-3 text-sm text-charcoal/85">
                Could not analyze this category: {result.error}
              </p>
            )}

            {!isPending && result && !result.error && result.matches.length === 0 && (
              <p className="text-sm text-muted">No candidates returned.</p>
            )}

            {!isPending && result && !result.error && result.matches.length > 0 && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[...result.matches]
                  .sort((a, b) => a.rank - b.rank)
                  .map((match) => {
                    const product = getProductById(match.id);
                    if (!product) return null;
                    return (
                      <ProductCard
                        key={match.id}
                        product={product}
                        match={match}
                        selected={selectedProducts[category] === match.id}
                        onSelect={() => onSelectProduct(category, match.id)}
                      />
                    );
                  })}
              </div>
            )}
          </div>
        );
      })}

      {(crossSellPending || crossSell.length > 0) && (
        <div className="border-t border-paper-line pt-6">
          <p className="mb-4 font-body text-xs uppercase tracking-[0.15em] text-muted">
            Also detected in this image
          </p>

          {crossSellPending && <SkeletonCards count={2} />}

          {!crossSellPending && crossSell.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {crossSell.map((item) => {
                const product = getProductById(item.match.id);
                if (!product) return null;
                return (
                  <div key={item.match.id}>
                    <p className="mb-2 font-body text-[10px] uppercase tracking-[0.15em] text-muted">
                      {CATEGORY_LABELS[item.category]}
                    </p>
                    <ProductCard
                      product={product}
                      match={item.match}
                      selected={selectedProducts[item.category] === item.match.id}
                      onSelect={() => onSelectProduct(item.category, item.match.id)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
