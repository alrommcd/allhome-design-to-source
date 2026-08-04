export type Category = "lighting" | "facades" | "hardware" | "surfaces";

export type Confidence = "High" | "Medium" | "Low";

export interface Product {
  id: string;
  brand: string;
  category: Category;
  productLine: string;
  description: string;
  styleTags: string[];
  materials: string[];
  imageUrl: string;
  imageVerified: boolean;
  priceRangeINR: [number, number];
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
