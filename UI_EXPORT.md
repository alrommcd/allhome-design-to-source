# UI Export

Full, unmodified source of every UI-relevant file in the project, for review. Generated 2026-08-05.
`lib/catalog.ts` is trimmed to its type import, header comment, and two representative sample entries
(the full 22-product data set is already working and isn't the point of this pass); every other file
below is complete.

---

## app/layout.tsx

```tsx
import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AllHome: Design-to-Source",
  description: "Match a room's design language to real AllHome product SKUs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-ink text-stone-light font-body antialiased">{children}</body>
    </html>
  );
}
```

---

## app/page.tsx

```tsx
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { templates, getTemplateById } from "@/lib/templates";
import { getProductById } from "@/lib/catalog";
import { CATEGORY_LABELS, type Category } from "@/lib/types";
import { fetchImageAsBase64 } from "@/lib/imageToBase64";
import TemplatePicker from "@/components/TemplatePicker";
import CategorySelector from "@/components/CategorySelector";
import ResultsPanel, { type CategoryResult } from "@/components/ResultsPanel";
import QuoteView from "@/components/QuoteView";
import Footer from "@/components/Footer";

type Status = "idle" | "loading" | "error" | "done";

export default function Home() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(new Set());
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [results, setResults] = useState<CategoryResult[]>([]);
  const [crossSell, setCrossSell] = useState<{ category: Category; match: { id: string; rank: number; rationale: string; confidence: "High" | "Medium" | "Low" } } | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Partial<Record<Category, string>>>({});
  const [view, setView] = useState<"source" | "quote">("source");

  const selectedTemplate = selectedTemplateId ? getTemplateById(selectedTemplateId) : null;

  const quoteProducts = useMemo(
    () =>
      Object.values(selectedProducts)
        .filter((id): id is string => Boolean(id))
        .map((id) => getProductById(id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [selectedProducts],
  );

  function toggleCategory(category: Category) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }

  async function handleAnalyze() {
    if (!selectedTemplate) {
      setErrorMessage("Select a template room first.");
      setStatus("error");
      return;
    }
    if (selectedCategories.size === 0) {
      setErrorMessage("Select at least one product category.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage(null);

    try {
      const { data, mimeType } = await fetchImageAsBase64(selectedTemplate.imageUrl);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: data,
          imageMimeType: mimeType,
          categories: Array.from(selectedCategories),
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed with status ${response.status}`);
      }

      const body = await response.json();
      setResults(body.results ?? []);
      setCrossSell(body.crossSell ?? null);
      setStatus("done");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Analysis failed. Try again.");
      setStatus("error");
    }
  }

  function selectProduct(category: Category, productId: string) {
    setSelectedProducts((prev) => ({ ...prev, [category]: productId }));
  }

  if (view === "quote") {
    return (
      <main className="min-h-screen px-6 py-10 md:px-10">
        <QuoteView products={quoteProducts} onBack={() => setView("source")} />
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bp-grid">
      <header className="border-b border-ink-line px-6 py-6 md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brass">AllHome</p>
        <h1 className="font-display text-2xl font-medium text-stone-light md:text-3xl">Design-to-Source</h1>
        <p className="mt-1 max-w-2xl text-sm text-stone">
          Select a template room, choose the product categories you need sourced, and match the room&apos;s
          design language to real AllHome SKUs.
        </p>
      </header>

      <div className="px-6 py-8 md:px-10">
        <div className="flex flex-col gap-8">
          <TemplatePicker templates={templates} selectedId={selectedTemplateId} onSelect={setSelectedTemplateId} />
          <CategorySelector selected={selectedCategories} onToggle={toggleCategory} />

          <div className="flex items-center gap-4">
            <button
              onClick={handleAnalyze}
              disabled={status === "loading"}
              className="border border-brass bg-brass px-6 py-2.5 font-mono text-xs uppercase tracking-widest text-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {status === "loading" ? "Analyzing…" : "Analyze"}
            </button>
            {status === "loading" && (
              <span className="flex items-center gap-2 font-mono text-xs text-stone">
                <span className="h-2 w-2 animate-pulse rounded-full bg-brass" />
                Matching against catalog for {selectedCategories.size} categor{selectedCategories.size === 1 ? "y" : "ies"}…
              </span>
            )}
            {status === "error" && errorMessage && (
              <span className="font-mono text-xs text-signal-low">{errorMessage}</span>
            )}
          </div>
        </div>

        {status === "done" && (
          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
            <aside className="lg:sticky lg:top-8 lg:self-start">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-stone">Template</p>
              <div className="corner-brackets relative aspect-[4/3] overflow-hidden border border-ink-line">
                {selectedTemplate && (
                  <Image src={selectedTemplate.imageUrl} alt={selectedTemplate.label} fill className="object-cover" />
                )}
              </div>
              <p className="mt-2 font-mono text-xs uppercase tracking-wider text-stone-light">
                {selectedTemplate?.label}
              </p>

              <div className="mt-6 border border-ink-line p-3">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-stone">Selected for quote</p>
                {quoteProducts.length === 0 && <p className="text-xs text-stone/60">Nothing selected yet</p>}
                <ul className="flex flex-col gap-1">
                  {quoteProducts.map((p) => (
                    <li key={p.id} className="text-xs text-stone-light">
                      {CATEGORY_LABELS[p.category]}: {p.productLine}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setView("quote")}
                  disabled={quoteProducts.length === 0}
                  className="mt-3 w-full border border-brass py-2 font-mono text-[11px] uppercase tracking-widest text-brass transition-colors hover:bg-brass hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Generate Quote
                </button>
              </div>
            </aside>

            <div>
              <ResultsPanel
                results={results}
                crossSell={crossSell}
                selectedProducts={selectedProducts}
                onSelectProduct={selectProduct}
              />
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
```

---

## app/review/page.tsx

```tsx
import { catalog } from "@/lib/catalog";
import { reviewNotes } from "@/lib/reviewNotes";
import ReviewGrid from "@/components/dev/ReviewGrid";

// Dev-only tool, not part of the production demo flow. Re-reads lib/catalog.ts
// fresh on every request so it reflects edits made by the verify-image API route.
export default function ReviewPage() {
  return (
    <div style={{ padding: 16, fontFamily: "sans-serif" }}>
      <h1>Image candidate review ({catalog.length} products)</h1>
      <p>
        Click Correct to flip imageVerified to true in lib/catalog.ts. Click Wrong to leave it false. It
        stays a pending-verification placeholder in the real app either way.
      </p>
      <ReviewGrid products={catalog} notes={reviewNotes} />
    </div>
  );
}
```

---

## app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  ::selection {
    background-color: #c9a45533;
    color: #e4c482;
  }
}

@layer utilities {
  .bp-grid {
    background-image:
      linear-gradient(rgba(201, 164, 85, 0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201, 164, 85, 0.07) 1px, transparent 1px);
    background-size: 32px 32px;
  }

  .corner-brackets {
    position: relative;
  }
  .corner-brackets::before,
  .corner-brackets::after {
    content: "";
    position: absolute;
    width: 10px;
    height: 10px;
    border-color: #c9a455;
    opacity: 0.6;
  }
  .corner-brackets::before {
    top: -1px;
    left: -1px;
    border-top: 1px solid;
    border-left: 1px solid;
  }
  .corner-brackets::after {
    bottom: -1px;
    right: -1px;
    border-bottom: 1px solid;
    border-right: 1px solid;
  }
}
```

---

## components/TemplatePicker.tsx

```tsx
import Image from "next/image";
import type { TemplateRoom } from "@/lib/types";

interface TemplatePickerProps {
  templates: TemplateRoom[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function TemplatePicker({ templates, selectedId, onSelect }: TemplatePickerProps) {
  return (
    <div>
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-stone">01. Select a template room</p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {templates.map((template) => {
          const selected = template.id === selectedId;
          return (
            <button
              key={template.id}
              onClick={() => onSelect(template.id)}
              className={`corner-brackets group relative aspect-[4/3] overflow-hidden border text-left transition-colors ${
                selected ? "border-brass" : "border-ink-line hover:border-stone"
              }`}
            >
              <Image src={template.imageUrl} alt={template.label} fill className="object-cover" />
              {template.isPlaceholder && (
                <span className="absolute right-2 top-2 border border-brass/40 bg-ink/80 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-brass">
                  Placeholder
                </span>
              )}
              <span className="absolute inset-x-0 bottom-0 bg-ink/85 px-2 py-1.5 font-mono text-[11px] uppercase tracking-wider text-stone-light">
                {template.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

---

## components/CategorySelector.tsx

```tsx
import { CATEGORY_LABELS, type Category } from "@/lib/types";

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

interface CategorySelectorProps {
  selected: Set<Category>;
  onToggle: (category: Category) => void;
}

export default function CategorySelector({ selected, onToggle }: CategorySelectorProps) {
  return (
    <div>
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-stone">02. Choose product categories</p>
      <div className="flex flex-wrap gap-2">
        {ALL_CATEGORIES.map((category) => {
          const active = selected.has(category);
          return (
            <button
              key={category}
              onClick={() => onToggle(category)}
              className={`border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
                active
                  ? "border-brass bg-brass text-ink"
                  : "border-ink-line text-stone-light hover:border-brass hover:text-brass"
              }`}
            >
              {CATEGORY_LABELS[category]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

---

## components/ResultsPanel.tsx

```tsx
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
            Also detected in this image: {CATEGORY_LABELS[crossSell.category]}
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
```

---

## components/ProductCard.tsx

```tsx
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
```

---

## components/ProductImage.tsx

```tsx
import type { Product } from "@/lib/types";

export default function ProductImage({ product }: { product: Product }) {
  if (!product.imageVerified || product.imageUrl === "PLACEHOLDER") {
    return (
      <div className="flex h-40 w-full flex-col items-center justify-center gap-1 border border-dashed border-ink-line bg-ink/60 bp-grid">
        <span className="font-mono text-[10px] uppercase tracking-widest text-stone">Image pending verification</span>
        <span className="px-4 text-center font-mono text-[10px] text-stone/70">{product.brand}, {product.productLine}</span>
      </div>
    );
  }

  return (
    <div className="relative h-40 w-full overflow-hidden border border-ink-line bg-ink/60">
      {/* eslint-disable-next-line @next/next/no-img-element -- verified images come from arbitrary
          third-party brand domains; next/image would require whitelisting each host individually */}
      <img
        src={product.imageUrl}
        alt={`${product.brand} ${product.productLine}`}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  );
}
```

---

## components/ConfidenceTag.tsx

```tsx
import type { Confidence } from "@/lib/types";

const STYLES: Record<Confidence, string> = {
  High: "border-signal-high/50 text-signal-high bg-signal-high/10",
  Medium: "border-signal-medium/50 text-signal-medium bg-signal-medium/10",
  Low: "border-signal-low/50 text-signal-low bg-signal-low/10",
};

export default function ConfidenceTag({ confidence }: { confidence: Confidence }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider ${STYLES[confidence]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {confidence} confidence
    </span>
  );
}
```

---

## components/QuoteView.tsx

```tsx
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
```

---

## components/Footer.tsx

```tsx
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-ink-line px-6 py-6 md:px-10">
      <p className="mx-auto max-w-4xl text-center font-mono text-[11px] leading-relaxed text-stone/70">
        Curated demo catalog. Product names and brands are real AllHome partner lines; some images are
        human-verified, others are placeholders pending verification. Pricing is illustrative only. The
        matching architecture scales to the full catalog and real pricing once connected to AllHome&apos;s
        systems.
      </p>
    </footer>
  );
}
```

---

## components/dev/ReviewGrid.tsx

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";

interface ReviewGridProps {
  products: Product[];
  notes: Record<string, string>;
}

export default function ReviewGrid({ products, notes }: ReviewGridProps) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [reviewed, setReviewed] = useState<Record<string, "correct" | "wrong">>({});
  const [error, setError] = useState<string | null>(null);

  async function handleVerify(id: string, verified: boolean) {
    setPendingId(id);
    setError(null);
    try {
      const res = await fetch("/api/dev/verify-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, verified }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed with status ${res.status}`);
      }
      setReviewed((prev) => ({ ...prev, [id]: verified ? "correct" : "wrong" }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {products.map((product) => {
          const hasCandidate = product.imageUrl && product.imageUrl !== "PLACEHOLDER";
          const status = reviewed[product.id];
          return (
            <div key={product.id} style={{ border: "1px solid #999", padding: 8 }}>
              <div style={{ fontSize: 11, color: "#666" }}>
                {product.category} · {product.brand}
              </div>
              <div style={{ fontWeight: "bold" }}>{product.productLine}</div>

              {hasCandidate ? (
                // eslint-disable-next-line @next/next/no-img-element -- dev-only tool, arbitrary external hosts
                <img
                  src={product.imageUrl}
                  alt={product.productLine}
                  style={{ width: "100%", height: 180, objectFit: "cover", margin: "8px 0" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: 180,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#eee",
                    margin: "8px 0",
                    fontSize: 12,
                    color: "#666",
                  }}
                >
                  No candidate found
                </div>
              )}

              {notes[product.id] && (
                <p style={{ fontSize: 11, color: "#a00", margin: "4px 0" }}>{notes[product.id]}</p>
              )}

              <p style={{ fontSize: 11, color: "#666", margin: "4px 0" }}>
                imageVerified: {String(product.imageVerified)}
                {status && ` (you marked this ${status} this session)`}
              </p>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => handleVerify(product.id, true)}
                  disabled={!hasCandidate || pendingId === product.id}
                >
                  ✓ Correct
                </button>
                <button onClick={() => handleVerify(product.id, false)} disabled={pendingId === product.id}>
                  ✗ Wrong / no good match
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

---

## tailwind.config.ts

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#15171A",
          panel: "#1D2023",
          line: "#2A2E33",
        },
        brass: {
          DEFAULT: "#C9A455",
          dim: "#8E7640",
          bright: "#E4C482",
        },
        stone: {
          DEFAULT: "#8A9199",
          light: "#B8BEC4",
        },
        signal: {
          high: "#5FA876",
          medium: "#C9A455",
          low: "#8A9199",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        blueprint:
          "linear-gradient(rgba(201,164,85,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,164,85,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "32px 32px",
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## lib/catalog.ts (excerpt: types, header comment, 2 of 22 sample entries)

```ts
import type { Product } from "./types";

/**
 * Every entry ships as imageUrl: "PLACEHOLDER", imageVerified: false until a
 * human opens the brand source page and confirms the image actually matches
 * the product. Leads to check (from research, not yet verified):
 *   Ledlum    -> ledlumlighting.com product listings
 *   Metalia   -> metaliaindia.com "Our Products"
 *   Fiamarc   -> fiamarc.com "Solutions" (Door Hinges, Door Handles, Furniture Handles)
 *   Shapes    -> shapeshw.com
 *   House of W -> thw.co.in (THG Paris / Tonino Lamborghini partner pages)
 *   Colour Coats -> colourcoats.com
 *   Window Factory AllHome gallery filenames (self-descriptive, higher confidence
 *   once opened): casement_window.jpg, glide_1.jpg, vertical_sliding.jpg,
 *   outdoor_retreat_1.jpg, outdoor_retreat_2.jpg, solaglide.jpg
 * Flip imageVerified to true and swap imageUrl only after visual confirmation.
 */

export const catalog: Product[] = [
  // ---- Lighting: Ledlum ----
  {
    id: "ledlum-slim-magnetic-track",
    brand: "Ledlum",
    category: "lighting",
    productLine: "Slim Magnetic Track Fixtures & Accessories",
    description:
      "Ultra-slim magnetic track system with modular spotlights, linear diffusers, and pendant accessories that snap onto a single low-profile rail. Built for ceilings that want continuous, adjustable light without visible fixtures breaking up the plane.",
    styleTags: ["minimalist", "modern"],
    materials: ["brushed aluminium", "matte black powder coat"],
    imageUrl: "https://d1qlyda1dsr5ui.cloudfront.net/ledlum/images/home/product/Indoor.jpeg",
    imageVerified: false,
    priceRangeINR: [8500, 32000],
    sourceUrl: "https://ledlumlighting.com",
  },
  {
    id: "ledlum-customised-indoor",
    brand: "Ledlum",
    category: "lighting",
    productLine: "Customised Indoor Lighting",
    description:
      "Made-to-spec indoor fixtures, from cove lighting profiles to sculptural pendants, sized and finished to a room's exact geometry. Sits comfortably in layered, contemporary interiors that mix ambient and task lighting.",
    styleTags: ["contemporary"],
    materials: ["aluminium", "opal acrylic diffuser"],
    imageUrl: "PLACEHOLDER",
    imageVerified: false,
    priceRangeINR: [12000, 65000],
    sourceUrl: "https://ledlumlighting.com",
  },

  // ... 20 more entries in the same shape, omitted for this UI review pass ...

];

export function getCatalogByCategory(category: Product["category"]): Product[] {
  return catalog.filter((product) => product.category === category);
}

export function getProductById(id: string): Product | undefined {
  return catalog.find((product) => product.id === id);
}
```
