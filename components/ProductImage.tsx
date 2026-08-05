import type { Product } from "@/lib/types";
import { buildImageSearchUrl } from "@/lib/catalog";

const STATUS_META: Record<Product["imageStatus"], { label: string; className: string }> = {
  verified: { label: "Verified", className: "border-signal-high/60 text-signal-high bg-signal-high/15" },
  representative: { label: "Representative Example", className: "border-brass/60 text-brass bg-brass/15" },
  pending: { label: "Pending Verification", className: "border-stone/60 text-stone bg-stone/15" },
};

export default function ProductImage({ product }: { product: Product }) {
  const meta = STATUS_META[product.imageStatus];
  const hasImage = product.imageStatus !== "pending" && product.imageUrl !== "PLACEHOLDER";

  return (
    <div className="relative h-40 w-full overflow-hidden border border-ink-line bg-ink/60">
      {hasImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- images come from arbitrary third-party brand domains, not whitelisted for next/image
        <img
          src={product.imageUrl}
          alt={`${product.brand} ${product.productLine}`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-ink-line bp-grid p-3 text-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-stone">No photo available</span>
          <a
            href={buildImageSearchUrl(product.brand, product.productLine)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] uppercase tracking-wider text-brass underline hover:text-brass-bright"
          >
            Search on Google
          </a>
        </div>
      )}
      <span
        className={`absolute left-2 top-2 border px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-widest ${meta.className}`}
      >
        {meta.label}
      </span>
    </div>
  );
}
