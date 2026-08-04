import { CATEGORY_LABELS, type Category } from "@/lib/types";

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

interface CategorySelectorProps {
  selected: Set<Category>;
  onToggle: (category: Category) => void;
}

export default function CategorySelector({ selected, onToggle }: CategorySelectorProps) {
  return (
    <div>
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-stone">02 — Choose product categories</p>
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
