"use client";

import { useState } from "react";
import { getProductById } from "@/lib/catalog";
import { CATEGORY_LABELS, type Category, type MatchResult } from "@/lib/types";
import ProductCard from "./ProductCard";

export interface CategoryResult {
  category: Category;
  matches: MatchResult[];
  error: string | null;
}

interface ResultsPanelProps {
  results: CategoryResult[];
  crossSell: { category: Category; match: MatchResult } | null;
  selectedProducts: Partial<Record<Category, string>>;
  onSelectProduct: (category: Category, productId: string) => void;
}

export default function ResultsPanel({ results, crossSell, selectedProducts, onSelectProduct }: ResultsPanelProps) {
  const [crossSellOpen, setCrossSellOpen] = useState(false);

  return (
    <div className="flex flex-col gap-10">
      {results.map((result) => (
        <div key={result.category}>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-brass">
            {CATEGORY_LABELS[result.category]}
          </p>

          {result.error && (
            <p className="border border-signal-low/40 bg-signal-low/5 p-3 text-sm text-stone">
              Could not analyze this category: {result.error}
            </p>
          )}

          {!result.error && result.matches.length === 0 && (
            <p className="text-sm text-stone">No candidates returned.</p>
          )}

          {!result.error && result.matches.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                      selected={selectedProducts[result.category] === match.id}
                      onSelect={() => onSelectProduct(result.category, match.id)}
                    />
                  );
                })}
            </div>
          )}
        </div>
      ))}

      {crossSell && (
        <div className="border-t border-ink-line pt-6">
          <button
            onClick={() => setCrossSellOpen((v) => !v)}
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-stone hover:text-brass"
          >
            <span>{crossSellOpen ? "▾" : "▸"}</span>
            Also detected in this image — {CATEGORY_LABELS[crossSell.category]}
          </button>

          {crossSellOpen && (
            <div className="mt-4 max-w-sm">
              {(() => {
                const product = getProductById(crossSell.match.id);
                if (!product) return null;
                return (
                  <ProductCard
                    product={product}
                    match={crossSell.match}
                    selected={selectedProducts[crossSell.category] === crossSell.match.id}
                    onSelect={() => onSelectProduct(crossSell.category, crossSell.match.id)}
                  />
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
