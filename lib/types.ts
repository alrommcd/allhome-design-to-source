export type Category = "lighting" | "facades" | "hardware" | "surfaces";

export type Confidence = "High" | "Medium" | "Low";

// verified: a human confirmed this photo is the actual real AllHome/brand SKU.
// representative: a real, honestly-sourced photo of the general product type, not a confirmed exact SKU.
// pending: no photo found or confirmed.
export type ImageStatus = "verified" | "representative" | "pending";

export interface Product {
  id: string;
  brand: string;
  category: Category;
  productLine: string;
  description: string;
  styleTags: string[];
  materials: string[];
  imageUrl: string;
  imageStatus: ImageStatus;
  sourceUrl: string;
}

export interface TemplateRoom {
  id: string;
  label: string;
  imageUrl: string;
  isPlaceholder: boolean;
}

export interface MatchResult {
  id: string;
  rank: number;
  rationale: string;
  confidence: Confidence;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  lighting: "Lighting",
  facades: "External Facades",
  hardware: "Home Hardware & Bath",
  surfaces: "Surface Treatments",
};
