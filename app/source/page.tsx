"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { templates, getTemplateById } from "@/lib/templates";
import { getProductById } from "@/lib/catalog";
import { CATEGORY_LABELS, type Category } from "@/lib/types";
import { compressImageForAnalysis } from "@/lib/imageToBase64";
import TemplatePicker from "@/components/TemplatePicker";
import CategorySelector from "@/components/CategorySelector";
import ResultsPanel, { type CategoryResult, type CrossSellItem } from "@/components/ResultsPanel";
import QuoteView from "@/components/QuoteView";
import Footer from "@/components/Footer";
import ToolHeader from "@/components/ToolHeader";

type Status = "idle" | "loading" | "error" | "done";

export default function SourcePage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(new Set());
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analyzedCategories, setAnalyzedCategories] = useState<Category[]>([]);
  const [pendingCategories, setPendingCategories] = useState<Set<Category>>(new Set());
  const [results, setResults] = useState<CategoryResult[]>([]);
  const [crossSellPending, setCrossSellPending] = useState(false);
  const [crossSell, setCrossSell] = useState<CrossSellItem[]>([]);
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

    const categoriesArray = Array.from(selectedCategories);

    setStatus("loading");
    setErrorMessage(null);
    setResults([]);
    setCrossSell([]);
    setAnalyzedCategories(categoriesArray);
    setPendingCategories(new Set(categoriesArray));
    setCrossSellPending(true);

    const t0 = performance.now();
    console.log("[client:timing] Analyze clicked, starting image prep");

    let imagePayload: { data: string; mimeType: string };
    try {
      imagePayload = await compressImageForAnalysis(selectedTemplate.imageUrl);
      console.log(
        `[client:timing] image compress+encode done, ms=${(performance.now() - t0).toFixed(0)} base64Bytes=${imagePayload.data.length}`,
      );
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Could not prepare the image.");
      setStatus("error");
      setPendingCategories(new Set());
      setCrossSellPending(false);
      return;
    }

    // Fire every selected category plus cross-sell in parallel, reusing the same
    // compressed image for all of them. Each updates state independently the
    // moment it resolves, instead of waiting for the whole batch.
    const categoryPromises = categoriesArray.map(async (category) => {
      const tCat = performance.now();
      console.log(`[client:timing] fetch category="${category}" START`);
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: imagePayload.data, imageMimeType: imagePayload.mimeType, category }),
        });
        console.log(`[client:timing] fetch category="${category}" END ms=${(performance.now() - tCat).toFixed(0)}`);
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody.error ?? `Request failed with status ${res.status}`);
        }
        const result: CategoryResult = await res.json();
        setResults((prev) => [...prev, result]);
      } catch (err) {
        setResults((prev) => [
          ...prev,
          { category, matches: [], error: err instanceof Error ? err.message : "Analysis failed for this category." },
        ]);
      } finally {
        setPendingCategories((prev) => {
          const next = new Set(prev);
          next.delete(category);
          return next;
        });
      }
    });

    const crossSellPromise = (async () => {
      const tCs = performance.now();
      console.log("[client:timing] fetch cross-sell START");
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: imagePayload.data,
            imageMimeType: imagePayload.mimeType,
            crossSellFor: categoriesArray,
          }),
        });
        console.log(`[client:timing] fetch cross-sell END ms=${(performance.now() - tCs).toFixed(0)}`);
        if (res.ok) {
          const resBody = await res.json();
          setCrossSell(resBody.crossSell ?? []);
        }
      } catch {
        // Cross-sell is supplementary; a network failure here shouldn't error the primary flow.
      } finally {
        setCrossSellPending(false);
      }
    })();

    await Promise.allSettled([...categoryPromises, crossSellPromise]);
    setStatus("done");
    console.log(`[client:timing] TOTAL end-to-end ms=${(performance.now() - t0).toFixed(0)}`);
  }

  function selectProduct(category: Category, productId: string) {
    setSelectedProducts((prev) => ({ ...prev, [category]: productId }));
  }

  if (view === "quote") {
    return (
      <main className="min-h-screen">
        <ToolHeader />
        <div className="px-6 py-10 md:px-10">
          <QuoteView products={quoteProducts} onBack={() => setView("source")} />
        </div>
        <Footer />
      </main>
    );
  }

  const showResults = status === "done" || (status === "loading" && analyzedCategories.length > 0);

  return (
    <main className="min-h-screen bp-grid">
      <ToolHeader />

      <div className="border-b border-paper-line px-6 py-6 md:px-10">
        <h1 className="font-display text-2xl font-medium text-charcoal md:text-3xl">Design-to-Source</h1>
      </div>

      <div className="px-6 py-10 md:px-10">
        <div className="flex flex-col gap-10">
          <TemplatePicker templates={templates} selectedId={selectedTemplateId} onSelect={setSelectedTemplateId} />
          <CategorySelector selected={selectedCategories} onToggle={toggleCategory} />

          <div className="flex items-center gap-4">
            <button
              onClick={handleAnalyze}
              disabled={status === "loading"}
              className="rounded-full bg-brass px-7 py-2.5 font-body text-xs font-medium uppercase tracking-widest text-charcoal transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {status === "loading" ? "Analyzing…" : "Analyze"}
            </button>
            {status === "loading" && (
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-2 text-xs text-muted">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-brass" />
                  Matching against catalog for {selectedCategories.size} categor{selectedCategories.size === 1 ? "y" : "ies"}…
                </span>
                <span className="text-[11px] text-muted/70">
                  Running on a free-tier Gemini API key, analysis may take a couple of minutes.
                </span>
              </div>
            )}
            {status === "error" && errorMessage && (
              <span className="text-xs text-signal-low">{errorMessage}</span>
            )}
          </div>
        </div>

        {showResults && (
          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
            <aside className="lg:sticky lg:top-8 lg:self-start">
              <p className="mb-3 font-body text-xs uppercase tracking-[0.15em] text-muted">Template</p>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-paper-line">
                {selectedTemplate && (
                  <Image src={selectedTemplate.imageUrl} alt={selectedTemplate.label} fill className="object-cover" />
                )}
              </div>
              <p className="mt-2 font-body text-xs uppercase tracking-wider text-charcoal">
                {selectedTemplate?.label}
              </p>

              <div className="mt-6 rounded-xl border border-paper-line bg-paper-surface p-4">
                <p className="mb-2 font-body text-[11px] uppercase tracking-[0.15em] text-muted">Added to quotation</p>
                {quoteProducts.length === 0 && <p className="text-xs text-muted/70">Nothing added yet</p>}
                <ul className="flex flex-col gap-1">
                  {quoteProducts.map((p) => (
                    <li key={p.id} className="text-xs text-charcoal">
                      {CATEGORY_LABELS[p.category]}: {p.productLine}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setView("quote")}
                  disabled={quoteProducts.length === 0}
                  className="mt-4 w-full rounded-full bg-brass py-2.5 font-body text-[11px] font-medium uppercase tracking-widest text-charcoal transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-paper-line disabled:text-muted disabled:opacity-100"
                >
                  View Quotation
                </button>
              </div>
            </aside>

            <div>
              <ResultsPanel
                analyzedCategories={analyzedCategories}
                pendingCategories={pendingCategories}
                results={results}
                crossSellPending={crossSellPending}
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
