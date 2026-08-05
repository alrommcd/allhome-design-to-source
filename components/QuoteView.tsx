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

  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={onBack} className="mb-6 font-mono text-xs uppercase tracking-wider text-stone hover:text-brass">
        ← Back to sourcing
      </button>

      <div className="corner-brackets mb-6 border border-brass/50 bg-brass/10 p-4">
        <p className="font-mono text-xs uppercase tracking-wider text-brass">
          This is a demonstration quotation request. Real pricing is provided directly by the AllHome team,
          not shown here.
        </p>
      </div>

      <h1 className="mb-6 font-display text-2xl font-medium text-stone-light">Quotation Request</h1>

      <div className="divide-y divide-ink-line border-y border-ink-line">
        {products.length === 0 && (
          <p className="py-8 text-center text-sm text-stone">Nothing added yet. Go back and add at least one match per category.</p>
        )}
        {products.map((product) => (
          <div key={product.id} className="py-4">
            <p className="font-mono text-[11px] uppercase tracking-wider text-brass">
              {CATEGORY_LABELS[product.category]}
            </p>
            <p className="font-display text-base text-stone-light">{product.productLine}</p>
            <p className="text-xs text-stone">{product.brand}</p>
          </div>
        ))}
      </div>

      <button
        disabled={products.length === 0}
        onClick={() => setRequested(true)}
        className="mt-6 w-full border border-brass bg-brass py-3 font-mono text-sm uppercase tracking-widest text-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
      >
        {requested ? "Request received. The AllHome team will follow up" : "Request Formal Quotation"}
      </button>
      <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-wider text-stone/60">
        Demonstration only. No request is actually sent
      </p>
    </div>
  );
}
