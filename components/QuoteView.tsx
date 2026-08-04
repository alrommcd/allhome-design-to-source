"use client";

import { useState } from "react";
import { CATEGORY_LABELS } from "@/lib/types";
import type { Product } from "@/lib/types";

interface QuoteViewProps {
  products: Product[];
  onBack: () => void;
}

export default function QuoteView({ products, onBack }: QuoteViewProps) {
  const [requested, setRequested] = useState(false);

  const subtotal = products.reduce((sum, p) => sum + (p.priceRangeINR[0] + p.priceRangeINR[1]) / 2, 0);

  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={onBack} className="mb-6 font-mono text-xs uppercase tracking-wider text-stone hover:text-brass">
        ← Back to sourcing
      </button>

      <div className="corner-brackets mb-6 border border-brass/50 bg-brass/10 p-4">
        <p className="font-mono text-xs uppercase tracking-wider text-brass">
          Sample estimate for demonstration. Actual pricing provided by the AllHome team.
        </p>
      </div>

      <h1 className="mb-6 font-display text-2xl font-medium text-stone-light">Sample Estimate</h1>

      <div className="divide-y divide-ink-line border-y border-ink-line">
        {products.length === 0 && (
          <p className="py-8 text-center text-sm text-stone">No products selected yet. Go back and select at least one match per category.</p>
        )}
        {products.map((product) => {
          const mid = Math.round((product.priceRangeINR[0] + product.priceRangeINR[1]) / 2);
          return (
            <div key={product.id} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-brass">
                  {CATEGORY_LABELS[product.category]}
                </p>
                <p className="font-display text-base text-stone-light">{product.productLine}</p>
                <p className="text-xs text-stone">{product.brand}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm text-stone-light">₹{mid.toLocaleString("en-IN")}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-stone/60">
                  ₹{product.priceRangeINR[0].toLocaleString("en-IN")}–₹{product.priceRangeINR[1].toLocaleString("en-IN")} est.
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {products.length > 0 && (
        <div className="flex items-center justify-between py-5">
          <p className="font-mono text-sm uppercase tracking-widest text-stone">Illustrative subtotal</p>
          <p className="font-mono text-xl text-brass">₹{Math.round(subtotal).toLocaleString("en-IN")}</p>
        </div>
      )}

      <button
        disabled={products.length === 0}
        onClick={() => setRequested(true)}
        className="w-full border border-brass bg-brass py-3 font-mono text-sm uppercase tracking-widest text-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
      >
        {requested ? "Request received. The AllHome team will follow up" : "Request Formal Quote"}
      </button>
      <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-wider text-stone/60">
        Demonstration only. No request is actually sent
      </p>
    </div>
  );
}
