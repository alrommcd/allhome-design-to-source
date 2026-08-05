import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type, ApiError } from "@google/genai";
import { catalog, getCatalogByCategory, getProductById } from "@/lib/catalog";
import type { Category, MatchResult } from "@/lib/types";

const CATEGORIES: Category[] = ["lighting", "facades", "hardware", "surfaces"];

const MAX_RETRIES = 2;

// Gemini reports transient overload as HTTP 503 with status "UNAVAILABLE" - safe to
// retry as-is. Anything else (400s, 429 quota exhaustion, auth errors) is a real
// bug or a hard stop and should surface immediately instead of being retried.
function isRetryableGeminiError(err: unknown): boolean {
  return err instanceof ApiError && err.status === 503;
}

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (!isRetryableGeminiError(err) || attempt >= MAX_RETRIES) throw err;
      const delayMs = 1000 * 2 ** attempt; // 1s, then 2s
      console.error(`Gemini 503 UNAVAILABLE, retrying in ${delayMs}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

const SYSTEM_PROMPT = `You are a product-matching assistant for an architecture and interiors studio. You will be shown a room or facade photo and a JSON list of candidate products from one product category.

Rank every candidate by how well its PHYSICAL FORM matches what is visible or structurally plausible in the photo: fixture shape, mounting style (recessed, surface-mounted, wall-mounted, suspended, freestanding), installation type, and material appearance. Compare what the candidate's description says it physically looks like against what is actually visible in the room.

Forbidden as justification: warmth, glow, ambiance, coziness, mood, or color temperature. A rationale like "matches the warm atmosphere" is invalid regardless of confidence tier.

Forbidden for these primary rankings: using the room's general layout or the presence of an unrelated element to justify a match. A visible exterior door or window does not by itself justify a confident match for an outdoor or landscape product in this category's ranking - that kind of inference belongs only in cross-category suggestions, never here.

Every candidate must be included, never omit one and never return an empty list. Rank best physical-form fit first.

For each candidate assign a confidence tier:
- "High": the candidate's physical form (fixture type, mounting style, shape) is clearly visible and matches what's in the photo.
- "Medium": a plausible physical-form fit based on material or installation type, not a literal visual confirmation.
- "Low": the closest available option among the candidates, shown for completeness, not a real match.

Each rationale must be one sentence naming the specific physical element observed (a fixture, mounting detail, material, or form) - never mood, warmth, ambiance, or general room layout.`;

const CROSS_SELL_SYSTEM_PROMPT = `You are a product-matching assistant for an architecture and interiors studio. You will be shown a room or facade photo and a JSON list of candidate products spanning categories the user did not select for primary analysis.

Unlike primary-category ranking, here you MAY use the room's general layout or context (e.g. a visible exterior door suggesting outdoor fixtures nearby) to surface plausible cross-category suggestions - this list is explicitly for that kind of broader inference.

Rank every candidate by plausible fit to the room. Every candidate must be included, never omit one and never return an empty list.

For each candidate assign a confidence tier:
- "High": clear physical or contextual fit to what's visible in the photo.
- "Medium": a plausible fit based on material, installation type, or room context.
- "Low": the closest available option among the candidates, shown for completeness.

Each rationale must be one sentence referencing something actually visible in the image.`;

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

// Cap at 1-2 results per category, prioritizing High confidence then Medium, never
// padding with 3+ just to fill space. If only Low-confidence candidates exist, show
// just the single best one rather than two weak guesses.
function selectTopMatches(matches: MatchResult[]): MatchResult[] {
  const sorted = [...matches].sort((a, b) => a.rank - b.rank);
  const high = sorted.filter((m) => m.confidence === "High");
  const medium = sorted.filter((m) => m.confidence === "Medium");
  const low = sorted.filter((m) => m.confidence === "Low");

  if (high.length === 0 && medium.length === 0) {
    return low.slice(0, 1);
  }
  return [...high, ...medium, ...low].slice(0, 2);
}

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
    systemPrompt: string,
    label: string,
    candidates: { id: string; brand: string; productLine: string; description: string; styleTags: string[] }[],
  ): Promise<MatchResult[]> {
    const response = await withRetry(() =>
      ai.models.generateContent({
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
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
          // Gemini 3.5's hidden "thinking" tokens count against maxOutputTokens.
          // 3072 was enough for single-category calls (max 9 candidates) but a live
          // test showed the cross-sell call (up to 16 candidates across 3 unselected
          // categories) got truncated into invalid JSON at that budget. Raised to
          // 4096 for headroom on the largest candidate set this route ever sends.
          maxOutputTokens: 4096,
        },
      }),
    );

    const raw = response.text;
    if (!raw) throw new Error("Empty response from model.");
    let cleaned: string;
    try {
      cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
      return JSON.parse(cleaned) as MatchResult[];
    } catch {
      throw new Error("Model response was not valid JSON.");
    }
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
        const matches = await rankCandidates(SYSTEM_PROMPT, category, candidates);
        return { category, matches: selectTopMatches(matches), error: null as string | null };
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
  let crossSell: { category: Category; match: MatchResult }[] = [];

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
      const ranked = await rankCandidates(
        CROSS_SELL_SYSTEM_PROMPT,
        "cross-category (any of: " + unselectedCategories.join(", ") + ")",
        crossCandidates,
      );
      const topTwo = [...ranked].sort((a, b) => a.rank - b.rank).slice(0, 2);
      crossSell = topTwo
        .map((match) => {
          const product = getProductById(match.id);
          return product ? { category: product.category, match } : null;
        })
        .filter((item): item is { category: Category; match: MatchResult } => item !== null);
    } catch (err) {
      console.error("Cross-sell ranking failed:", err);
      crossSell = [];
    }
  }

  return NextResponse.json({ results, crossSell });
}
