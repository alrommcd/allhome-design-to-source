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
        Click Correct to mark this image Verified in lib/catalog.ts. Click Wrong to mark it Pending,
        which removes the representative image from display and shows the search-on-Google fallback
        instead.
      </p>
      <ReviewGrid products={catalog} notes={reviewNotes} />
    </div>
  );
}
