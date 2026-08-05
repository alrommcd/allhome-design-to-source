"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ImageStatus, Product } from "@/lib/types";

interface ReviewGridProps {
  products: Product[];
  notes: Record<string, string>;
}

const COLORS = {
  border: "#E3DAC9",
  surface: "#FBF8F2",
  charcoal: "#2A2520",
  muted: "#8C8477",
  brass: "#C9A455",
  terracotta: "#B4694B",
  placeholderBg: "#F0EAD9",
};

export default function ReviewGrid({ products, notes }: ReviewGridProps) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [reviewed, setReviewed] = useState<Record<string, ImageStatus>>({});
  const [error, setError] = useState<string | null>(null);

  async function handleVerify(id: string, status: ImageStatus) {
    setPendingId(id);
    setError(null);
    try {
      const res = await fetch("/api/dev/verify-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed with status ${res.status}`);
      }
      setReviewed((prev) => ({ ...prev, [id]: status }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="mt-6">
      {error && <p style={{ color: COLORS.terracotta }}>Error: {error}</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {products.map((product) => {
          const hasCandidate = product.imageStatus !== "pending" && product.imageUrl !== "PLACEHOLDER";
          const sessionStatus = reviewed[product.id];
          return (
            <div
              key={product.id}
              style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 12, background: COLORS.surface }}
            >
              <div style={{ fontSize: 11, color: COLORS.muted }}>
                {product.category} · {product.brand}
              </div>
              <div style={{ fontWeight: 600, color: COLORS.charcoal }}>{product.productLine}</div>

              {hasCandidate ? (
                // eslint-disable-next-line @next/next/no-img-element -- dev-only tool, arbitrary external hosts
                <img
                  src={product.imageUrl}
                  alt={product.productLine}
                  style={{ width: "100%", height: 180, objectFit: "cover", margin: "8px 0", borderRadius: 8 }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: 180,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: COLORS.placeholderBg,
                    borderRadius: 8,
                    margin: "8px 0",
                    fontSize: 12,
                    color: COLORS.muted,
                  }}
                >
                  No candidate found
                </div>
              )}

              {notes[product.id] && (
                <p style={{ fontSize: 11, color: COLORS.terracotta, margin: "4px 0" }}>{notes[product.id]}</p>
              )}

              <p style={{ fontSize: 11, color: COLORS.muted, margin: "4px 0" }}>
                imageStatus: {product.imageStatus}
                {sessionStatus && ` (you marked this ${sessionStatus} this session)`}
              </p>

              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button
                  onClick={() => handleVerify(product.id, "verified")}
                  disabled={!hasCandidate || pendingId === product.id}
                  style={{
                    borderRadius: 999,
                    border: `1px solid ${COLORS.brass}`,
                    background: COLORS.brass,
                    color: COLORS.charcoal,
                    padding: "4px 12px",
                    fontSize: 12,
                    fontWeight: 500,
                    opacity: !hasCandidate || pendingId === product.id ? 0.4 : 1,
                  }}
                >
                  Correct: mark Verified
                </button>
                <button
                  onClick={() => handleVerify(product.id, "pending")}
                  disabled={pendingId === product.id}
                  style={{
                    borderRadius: 999,
                    border: `1px solid ${COLORS.border}`,
                    background: "transparent",
                    color: COLORS.muted,
                    padding: "4px 12px",
                    fontSize: 12,
                    fontWeight: 500,
                    opacity: pendingId === product.id ? 0.4 : 1,
                  }}
                >
                  Wrong: mark Pending
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
