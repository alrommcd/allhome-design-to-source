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
      <button onClick={onBack} className="mb-6 font-body text-xs uppercase tracking-wider text-muted transition-colors hover:text-brass">
        ← Back to sourcing
      </button>

      <div className="mb-6 rounded-xl border border-brass/40 bg-brass/[0.08] p-4">
        <p className="font-body text-xs uppercase tracking-wider text-brass">
          This is a demonstration quotation request. Real pricing is provided directly by the AllHome team,
          not shown here.
        </p>
      </div>

      <h1 className="mb-6 font-display text-2xl font-medium text-charcoal">Quotation Request</h1>

      <div className="divide-y divide-paper-line rounded-xl border border-paper-line bg-paper-surface">
        {products.length === 0 && (
          <p className="py-8 text-center text-sm text-muted">Nothing added yet. Go back and add at least one match per category.</p>
        )}
        {products.map((product) => (
          <div key={product.id} className="px-5 py-4">
            <p className="font-body text-[11px] uppercase tracking-wider text-brass">
              {CATEGORY_LABELS[product.category]}
            </p>
            <p className="font-display text-base text-charcoal">{product.productLine}</p>
            <p className="text-xs text-muted">{product.brand}</p>
          </div>
        ))}
      </div>

      <button
        disabled={products.length === 0}
        onClick={() => setRequested(true)}
        className="mt-6 w-full rounded-full bg-brass py-3 font-body text-sm font-medium uppercase tracking-widest text-charcoal transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {requested ? "Request received. The AllHome team will follow up" : "Request Formal Quotation"}
      </button>
      <p className="mt-3 text-center font-body text-[10px] uppercase tracking-wider text-muted/80">
        Demonstration only. No request is actually sent
      </p>
    </div>
  );
}
