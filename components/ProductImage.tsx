import type { Product } from "@/lib/types";
import { buildImageSearchUrl } from "@/lib/catalog";

const STATUS_META: Record<Product["imageStatus"], { label: string; className: string }> = {
  verified: { label: "Verified", className: "border-signal-high/50 text-signal-high bg-signal-high/10" },
  representative: { label: "Representative Example", className: "border-brass/50 text-brass bg-brass/10" },
  pending: { label: "Pending Verification", className: "border-muted/50 text-muted bg-muted/10" },
};

export default function ProductImage({ product }: { product: Product }) {
  const meta = STATUS_META[product.imageStatus];
  const hasImage = product.imageStatus !== "pending" && product.imageUrl !== "PLACEHOLDER";

  return (
    <div className="relative h-40 w-full overflow-hidden rounded-lg border border-paper-line bg-paper-surface">
      {hasImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- images come from arbitrary third-party brand domains, not whitelisted for next/image
        <img
          src={product.imageUrl}
          alt={`${product.brand} ${product.productLine}`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-3 text-center">
          <span className="font-body text-[10px] uppercase tracking-widest text-muted">No photo available</span>
          <a
            href={buildImageSearchUrl(product.brand, product.productLine)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-[10px] uppercase tracking-wider text-brass underline decoration-brass/40 underline-offset-2 hover:text-brass-dim"
          >
            Search on Google
          </a>
        </div>
      )}
      <span
        className={`absolute left-2 top-2 rounded-full border px-2 py-0.5 font-body text-[9px] font-medium uppercase tracking-widest ${meta.className}`}
      >
        {meta.label}
      </span>
    </div>
  );
}
