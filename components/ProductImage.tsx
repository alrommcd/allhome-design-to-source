import Image from "next/image";
import type { Product } from "@/lib/types";

export default function ProductImage({ product }: { product: Product }) {
  if (!product.imageVerified || product.imageUrl === "PLACEHOLDER") {
    return (
      <div className="flex h-40 w-full flex-col items-center justify-center gap-1 border border-dashed border-ink-line bg-ink/60 bp-grid">
        <span className="font-mono text-[10px] uppercase tracking-widest text-stone">Image pending verification</span>
        <span className="px-4 text-center font-mono text-[10px] text-stone/70">{product.brand} — {product.productLine}</span>
      </div>
    );
  }

  return (
    <div className="relative h-40 w-full overflow-hidden border border-ink-line bg-ink/60">
      <Image src={product.imageUrl} alt={`${product.brand} ${product.productLine}`} fill className="object-cover" />
    </div>
  );
}
