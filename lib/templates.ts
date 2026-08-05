import type { TemplateRoom } from "./types";

// Facade/exterior template intentionally last - interior templates lead since
// they're the more immediately legible starting point for most demo walkthroughs.
export const templates: TemplateRoom[] = [
  {
    id: "livingroom",
    label: "Sunset Living Room",
    imageUrl: "/templates/livingroom.png",
    isPlaceholder: false,
  },
  {
    id: "reception",
    label: "Reception & Lounge",
    imageUrl: "/templates/reception.png",
    isPlaceholder: false,
  },
  {
    id: "washroom",
    label: "Powder Room Suite",
    imageUrl: "/templates/washroom.png",
    isPlaceholder: false,
  },
  {
    id: "elevation",
    label: "Terracotta-Clad Elevation",
    imageUrl: "/templates/elevation.png",
    isPlaceholder: false,
  },
];

export function getTemplateById(id: string): TemplateRoom | undefined {
  return templates.find((template) => template.id === id);
}
