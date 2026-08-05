import { CATEGORY_LABELS, type Category } from "@/lib/types";

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

interface CategorySelectorProps {
  selected: Set<Category>;
  onToggle: (category: Category) => void;
}

export default function CategorySelector({ selected, onToggle }: CategorySelectorProps) {
  return (
    <div>
      <p className="mb-3 font-body text-xs uppercase tracking-[0.15em] text-muted">Choose product categories</p>
      <div className="flex flex-wrap gap-2.5">
        {ALL_CATEGORIES.map((category) => {
          const active = selected.has(category);
          return (
            <button
              key={category}
              onClick={() => onToggle(category)}
              className={`rounded-full border px-5 py-2 font-body text-xs font-medium uppercase tracking-wider transition-colors ${
                active
                  ? "border-brass bg-brass text-charcoal"
                  : "border-brass/50 bg-transparent text-brass hover:border-brass hover:bg-brass/10"
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
