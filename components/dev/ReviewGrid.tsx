"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ImageStatus, Product } from "@/lib/types";

interface ReviewGridProps {
  products: Product[];
  notes: Record<string, string>;
}

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
    <div>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {products.map((product) => {
          const hasCandidate = product.imageStatus !== "pending" && product.imageUrl !== "PLACEHOLDER";
          const sessionStatus = reviewed[product.id];
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
                imageStatus: {product.imageStatus}
                {sessionStatus && ` (you marked this ${sessionStatus} this session)`}
              </p>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => handleVerify(product.id, "verified")}
                  disabled={!hasCandidate || pendingId === product.id}
                >
                  ✓ Correct: mark Verified
                </button>
                <button onClick={() => handleVerify(product.id, "pending")} disabled={pendingId === product.id}>
                  ✗ Wrong: mark Pending
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
