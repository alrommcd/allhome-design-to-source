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

export interface CrossSellItem {
  category: Category;
  match: MatchResult;
}

interface ResultsPanelProps {
  results: CategoryResult[];
  crossSell: CrossSellItem[];
  selectedProducts: Partial<Record<Category, string>>;
  onSelectProduct: (category: Category, productId: string) => void;
}

export default function ResultsPanel({ results, crossSell, selectedProducts, onSelectProduct }: ResultsPanelProps) {
  const [crossSellOpen, setCrossSellOpen] = useState(false);

  return (
    <div className="flex flex-col gap-10">
      {results.map((result) => (
        <div key={result.category}>
          <p className="mb-3 font-body text-xs uppercase tracking-[0.15em] text-brass">
            {CATEGORY_LABELS[result.category]}
          </p>

          {result.error && (
            <p className="rounded-xl border border-signal-low/30 bg-signal-low/[0.06] p-3 text-sm text-charcoal/85">
              Could not analyze this category: {result.error}
            </p>
          )}

          {!result.error && result.matches.length === 0 && (
            <p className="text-sm text-muted">No candidates returned.</p>
          )}

          {!result.error && result.matches.length > 0 && (
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
                      selected={selectedProducts[result.category] === match.id}
                      onSelect={() => onSelectProduct(result.category, match.id)}
                    />
                  );
                })}
            </div>
          )}
        </div>
      ))}

      {crossSell.length > 0 && (
        <div className="border-t border-paper-line pt-6">
          <button
            onClick={() => setCrossSellOpen((v) => !v)}
            className="flex items-center gap-2 font-body text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:text-brass"
          >
            <span>{crossSellOpen ? "▾" : "▸"}</span>
            Also detected in this image
          </button>

          {crossSellOpen && (
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
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
