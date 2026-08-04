import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { catalog, getCatalogByCategory, getProductById } from "@/lib/catalog";
import type { Category, MatchResult } from "@/lib/types";

const CATEGORIES: Category[] = ["lighting", "facades", "hardware", "surfaces"];

const SYSTEM_PROMPT = `You are a design-sourcing assistant for an architecture and interiors studio.
You will be shown a room/facade image and a JSON list of candidate products from one product category.
Rank every candidate by how well it fits the image's actual visible style, palette, and materials.
Not every candidate will visually resemble something in the image - that is expected. Always return
the full ranked list, covering every candidate id given, ordered best-fit first. Never return an empty
list and never omit a candidate.
For each candidate assign a confidence tier:
- "High": clear visual or style resonance with the actual image.
- "Medium": a plausible fit on style or material, not a literal visual match.
- "Low": the closest available option among the candidates, shown for completeness.
Each rationale must be one sentence and must reference something actually visible in the image
(palette, material, form, mood) - do not write generic marketing copy.`;

const RESPONSE_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      rank: { type: Type.INTEGER },
      rationale: { type: Type.STRING },
      confidence: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
    },
    required: ["id", "rank", "rationale", "confidence"],
    propertyOrdering: ["id", "rank", "rationale", "confidence"],
  },
};

interface AnalyzeRequestBody {
  imageBase64: string;
  imageMimeType: string;
  categories: Category[];
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is missing GEMINI_API_KEY. Set it in .env.local and restart the dev server." },
      { status: 500 },
    );
  }

  let body: AnalyzeRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  const { imageBase64, imageMimeType, categories } = body;

  if (!imageBase64 || !imageMimeType) {
    return NextResponse.json({ error: "Missing imageBase64 or imageMimeType." }, { status: 400 });
  }
  const selectedCategories = (categories ?? []).filter((c) => CATEGORIES.includes(c));
  if (selectedCategories.length === 0) {
    return NextResponse.json({ error: "Select at least one category to analyze." }, { status: 400 });
  }

  const ai = new GoogleGenAI({ apiKey });

  async function rankCandidates(
    label: string,
    candidates: { id: string; brand: string; productLine: string; description: string; styleTags: string[] }[],
  ): Promise<MatchResult[]> {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: imageMimeType, data: imageBase64 } },
            { text: `Category: ${label}\nCandidate products (JSON):\n${JSON.stringify(candidates)}` },
          ],
        },
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        // Gemini 3.5's hidden "thinking" tokens count against maxOutputTokens.
        // 1000 was tuned for Anthropic's non-thinking token accounting and
        // truncated real responses mid-JSON once thinking overhead was included.
        maxOutputTokens: 3072,
      },
    });

    const raw = response.text;
    if (!raw) throw new Error("Empty response from model.");
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
    return JSON.parse(cleaned) as MatchResult[];
  }

  const results = await Promise.all(
    selectedCategories.map(async (category) => {
      const candidates = getCatalogByCategory(category).map((p) => ({
        id: p.id,
        brand: p.brand,
        productLine: p.productLine,
        description: p.description,
        styleTags: p.styleTags,
      }));

      try {
        const matches = await rankCandidates(category, candidates);
        return { category, matches, error: null as string | null };
      } catch (err) {
        return {
          category,
          matches: [] as MatchResult[],
          error: err instanceof Error ? err.message : "Analysis failed for this category.",
        };
      }
    }),
  );

  const unselectedCategories = CATEGORIES.filter((c) => !selectedCategories.includes(c));
  let crossSell: { category: Category; match: MatchResult } | null = null;

  if (unselectedCategories.length > 0) {
    const crossCandidates = catalog
      .filter((p) => unselectedCategories.includes(p.category))
      .map((p) => ({
        id: p.id,
        brand: p.brand,
        productLine: p.productLine,
        description: p.description,
        styleTags: p.styleTags,
      }));

    try {
      const ranked = await rankCandidates("cross-category (any of: " + unselectedCategories.join(", ") + ")", crossCandidates);
      const top = [...ranked].sort((a, b) => a.rank - b.rank)[0];
      const product = top ? getProductById(top.id) : undefined;
      if (top && product) {
        crossSell = { category: product.category, match: top };
      }
    } catch (err) {
      console.error("Cross-sell ranking failed:", err);
      crossSell = null;
    }
  }

  return NextResponse.json({ results, crossSell });
}
