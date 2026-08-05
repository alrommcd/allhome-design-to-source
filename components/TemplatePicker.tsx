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
      <p className="mb-3 font-body text-xs uppercase tracking-[0.15em] text-muted">Select a template room</p>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {templates.map((template) => {
          const selected = template.id === selectedId;
          return (
            <button
              key={template.id}
              onClick={() => onSelect(template.id)}
              className={`group relative aspect-[4/3] overflow-hidden rounded-xl border text-left transition-colors ${
                selected ? "border-brass ring-1 ring-brass" : "border-paper-line hover:border-muted"
              }`}
            >
              <Image src={template.imageUrl} alt={template.label} fill className="object-cover" />
              <span className="absolute inset-x-0 bottom-0 bg-charcoal/75 px-3 py-2 font-body text-[11px] uppercase tracking-wider text-paper">
                {template.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
