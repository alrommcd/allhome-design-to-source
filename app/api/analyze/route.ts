import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type, ApiError } from "@google/genai";
import { catalog, getCatalogByCategory, getProductById } from "@/lib/catalog";
import type { Category, MatchResult } from "@/lib/types";

const CATEGORIES: Category[] = ["lighting", "facades", "hardware", "surfaces"];
const GEMINI_MODEL = "gemini-3.5-flash";

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

type CandidateForModel = { id: string; brand: string; productLine: string; description: string; styleTags: string[] };

function toCandidates(category: Category): CandidateForModel[] {
  return getCatalogByCategory(category).map((p) => ({
    id: p.id,
    brand: p.brand,
    productLine: p.productLine,
    description: p.description,
    styleTags: p.styleTags,
  }));
}

// One request does exactly one unit of work: rank a single category, OR compute the
// cross-sell suggestion. This lets the client fire every selected category plus
// cross-sell as separate parallel requests and render each the moment it resolves,
// instead of one request that internally does everything and blocks on the slowest
// piece (previously cross-sell ran sequentially after the primary batch, adding its
// full duration on top instead of overlapping with it).
interface AnalyzeRequestBody {
  imageBase64: string;
  imageMimeType: string;
  category?: Category;
  crossSellFor?: Category[];
}

export async function POST(req: NextRequest) {
  const requestStart = Date.now();
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

  const { imageBase64, imageMimeType, category, crossSellFor } = body;

  if (!imageBase64 || !imageMimeType) {
    return NextResponse.json({ error: "Missing imageBase64 or imageMimeType." }, { status: 400 });
  }
  if (!category && !crossSellFor) {
    return NextResponse.json({ error: "Body must include either `category` or `crossSellFor`." }, { status: 400 });
  }

  const ai = new GoogleGenAI({ apiKey });

  async function rankCandidates(systemPrompt: string, label: string, candidates: CandidateForModel[]): Promise<MatchResult[]> {
    const callStart = Date.now();
    console.log(`[analyze:timing] Gemini call START label="${label}" candidateCount=${candidates.length}`);
    const response = await withRetry(() =>
      ai.models.generateContent({
        model: GEMINI_MODEL,
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
          maxOutputTokens: 4096,
        },
      }),
    );
    console.log(`[analyze:timing] Gemini call END label="${label}" durationMs=${Date.now() - callStart}`);

    const raw = response.text;
    if (!raw) throw new Error("Empty response from model.");
    try {
      const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
      return JSON.parse(cleaned) as MatchResult[];
    } catch {
      throw new Error("Model response was not valid JSON.");
    }
  }

  // Mode 1: rank a single category.
  if (category) {
    if (!CATEGORIES.includes(category)) {
      return NextResponse.json({ error: `Unknown category "${category}".` }, { status: 400 });
    }
    try {
      const matches = await rankCandidates(SYSTEM_PROMPT, category, toCandidates(category));
      console.log(`[analyze:timing] category="${category}" TOTAL requestDurationMs=${Date.now() - requestStart}`);
      return NextResponse.json({ category, matches: selectTopMatches(matches), error: null });
    } catch (err) {
      console.log(`[analyze:timing] category="${category}" FAILED requestDurationMs=${Date.now() - requestStart}`);
      return NextResponse.json({
        category,
        matches: [],
        error: err instanceof Error ? err.message : "Analysis failed for this category.",
      });
    }
  }

  // Mode 2: cross-sell across whatever the client says is unselected.
  const selected = (crossSellFor ?? []).filter((c) => CATEGORIES.includes(c));
  const unselectedCategories = CATEGORIES.filter((c) => !selected.includes(c));

  if (unselectedCategories.length === 0) {
    return NextResponse.json({ crossSell: [] });
  }

  const crossCandidates = catalog
    .filter((p) => unselectedCategories.includes(p.category))
    .map((p) => ({ id: p.id, brand: p.brand, productLine: p.productLine, description: p.description, styleTags: p.styleTags }));

  try {
    const ranked = await rankCandidates(
      CROSS_SELL_SYSTEM_PROMPT,
      "cross-category (any of: " + unselectedCategories.join(", ") + ")",
      crossCandidates,
    );
    const topTwo = [...ranked].sort((a, b) => a.rank - b.rank).slice(0, 2);
    const crossSell = topTwo
      .map((match) => {
        const product = getProductById(match.id);
        return product ? { category: product.category, match } : null;
      })
      .filter((item): item is { category: Category; match: MatchResult } => item !== null);
    console.log(`[analyze:timing] cross-sell TOTAL requestDurationMs=${Date.now() - requestStart}`);
    return NextResponse.json({ crossSell });
  } catch (err) {
    console.error("Cross-sell ranking failed:", err);
    console.log(`[analyze:timing] cross-sell FAILED requestDurationMs=${Date.now() - requestStart}`);
    return NextResponse.json({ crossSell: [] });
  }
}
