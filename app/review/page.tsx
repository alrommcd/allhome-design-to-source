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
