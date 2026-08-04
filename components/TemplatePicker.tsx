import Image from "next/image";
import type { TemplateRoom } from "@/lib/types";

interface TemplatePickerProps {
  templates: TemplateRoom[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function TemplatePicker({ templates, selectedId, onSelect }: TemplatePickerProps) {
  return (
    <div>
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-stone">01 — Select a template room</p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {templates.map((template) => {
          const selected = template.id === selectedId;
          return (
            <button
              key={template.id}
              onClick={() => onSelect(template.id)}
              className={`corner-brackets group relative aspect-[4/3] overflow-hidden border text-left transition-colors ${
                selected ? "border-brass" : "border-ink-line hover:border-stone"
              }`}
            >
              <Image src={template.imageUrl} alt={template.label} fill className="object-cover" />
              {template.isPlaceholder && (
                <span className="absolute right-2 top-2 border border-brass/40 bg-ink/80 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-brass">
                  Placeholder
                </span>
              )}
              <span className="absolute inset-x-0 bottom-0 bg-ink/85 px-2 py-1.5 font-mono text-[11px] uppercase tracking-wider text-stone-light">
                {template.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
