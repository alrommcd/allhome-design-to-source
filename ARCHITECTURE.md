# How AllHome Design-to-Source Actually Works

This document explains the working system end to end, in plain language, for anyone reviewing it before
a demo. You shouldn't need to read code to understand what happens when you click a button. Numbers in
this document (catalog counts, verification status) were pulled directly from the live code on
2026-08-05, not estimated.

---

## 1. What happens, step by step, when someone uses the app

### Step 1: Pick a template room
The homepage shows four real architectural renders: a terracotta-clad house exterior, a sunset-lit living
room, a reception/lounge, and a powder room. These are actual photos sitting in the `public/templates/`
folder. Nothing about this step calls any AI. Clicking one just remembers which one you picked.

### Step 2: Pick product categories
Four buttons: Lighting, External Facades, Home Hardware & Bath, Surface Treatments. You can pick any
number of them, in any order. This also doesn't call any AI yet. It's just telling the app which parts
of the catalog to search against.

### Step 3: Click "Analyze"
This is where the real work starts. The browser does three things:
1. Fetches the actual image file of the template room you picked (e.g. the living room photo) and
   converts it into a long text string (base64). This is just how images get sent over the internet as
   part of a request, the same photo, re-encoded.
2. Sends that image, plus the list of categories you picked, to our own server (`/api/analyze`).
3. Shows a "Matching against catalog…" spinner while it waits.

### Step 4: What our server sends to Gemini (Google's AI)
For **each category you selected**, separately, our server makes one request to Gemini. Each request
contains:
- The actual template room photo (the real image, not a description of it).
- The full list of candidate products in that category from our catalog: id, brand, product line name,
  the descriptive paragraph, and style tags (e.g. "minimalist", "industrial"). **No price is included in
  what gets sent to Gemini, see Section 4 for why that matters.**
- Instructions telling Gemini to rank every candidate by how well it actually fits what's visible in the
  photo (style, palette, materials), and to never leave any candidate out or return an empty list.

If you selected categories that leave others unselected (say you picked only Lighting), the server also
makes **one extra call** covering all the unselected categories combined, asking for the single best
cross-category match. This becomes the "Also detected in this image" suggestion.

So: selecting 2 categories triggers 3 total Gemini calls (one per selected category, plus one cross-sell
call). Selecting all 4 triggers 4 calls (no unselected categories left, so no cross-sell call).

### Step 5: What Gemini sends back
For each call, Gemini returns a ranked list covering **every** candidate it was given (never a partial or
empty list), where each item has:
- Which product it is
- Its rank (1st best fit, 2nd, etc.)
- A one-sentence reason, which is required to reference something actually visible in the photo. Not
  generic marketing language
- A confidence label: **High** (a real visual/style match), **Medium** (plausible on style or material,
  not a literal visual match), or **Low** (the closest available option, included for completeness, not
  a real match)

Our server never invents or edits these rankings. Whatever Gemini returns is what gets shown, as-is.

### Step 6: How results render on screen
The screen splits in two: your chosen template stays pinned on the left, and results for each category
you picked appear on the right, 2–6 product cards per category (as many as exist in our catalog for that
category), ordered best-fit first.
- **High confidence** cards render normally.
- **Medium and Low confidence** cards get a visibly different treatment: a small "Closest available
  match" label appears above the card, and the whole card is slightly dimmed. So nobody mistakes a
  stylistic guess for a real detection.
- If a cross-sell match was found, it appears below, collapsed by default, under a label like "Also
  detected in this image: External Facades". You have to click to expand it.

### Step 7: Selecting products
For each category shown, you can click "Select" on one product. That just gets remembered in the
browser's memory. Nothing is saved anywhere permanent, and nothing is sent to a server at this point.

### Step 8: Generate Quote
Clicking "Generate Quote" switches to a summary screen listing everything you've selected across all
categories, with a clearly labeled banner: *"Sample estimate for demonstration. Actual pricing provided
by the AllHome team."* There's also a "Request Formal Quote" button. Clicking it just shows a
confirmation message on screen. **It does not send an email, create a record, or contact anyone.** It
exists to show what that button would eventually do, not to actually do it.

### How the quote total gets calculated
Every product in our catalog has a stored price *range* (a low and high number, in rupees). This is a
made-up illustrative range, not a real AllHome price (see Section 4). For each selected product, the
screen takes the **midpoint** of its range (low + high, divided by 2) and shows that as the line-item
price. The "Illustrative subtotal" at the bottom is just those midpoints added together. That's the
entire calculation. No tax, no markup, no real pricing logic, because there is no real pricing to work
with yet.

---

## 2. File structure: what each piece does

| File / folder | What it does |
|---|---|
| `app/page.tsx` | The main screen. Template picker, category picker, Analyze button, results, and the quote view are all driven from here. |
| `app/api/analyze/route.ts` | The server code that talks to Gemini. Builds the request per category, sends the image and candidates, parses what comes back. This is the only file that ever calls the AI. |
| `app/api/dev/verify-image/route.ts` | A dev-only helper (see Section 5) that flips a product's "image confirmed" flag on or off when reviewing candidate photos tonight. Disabled automatically outside development. |
| `app/review/page.tsx` + `components/dev/ReviewGrid.tsx` | The dev-only review tool for clicking through candidate product photos and confirming/rejecting them. Not part of the customer-facing demo. |
| `lib/catalog.ts` | **The entire product catalog lives here**. Every product's brand, name, description, style tags, price range, and image status. This is the single source of truth; nothing about the catalog comes from anywhere else. |
| `lib/reviewNotes.ts` | Research notes from tonight's automated image search (e.g. "this brand doesn't actually sell a product by this name"). Only shown on the dev review page, never in the real app. |
| `lib/templates.ts` | The list of the four template rooms and which image file each one points to. |
| `lib/types.ts` | Defines the shape of a "Product" and a "Template". Not logic, just the structure other files rely on. |
| `lib/imageToBase64.ts` | The small helper that converts a template photo into the text format needed to send to Gemini. |
| `components/TemplatePicker.tsx` | Renders the four template thumbnails you click on. |
| `components/CategorySelector.tsx` | Renders the four category toggle buttons. |
| `components/ResultsPanel.tsx` | Lays out the ranked results per category, plus the collapsed cross-sell section. |
| `components/ProductCard.tsx` | A single product result card. Image, brand, rationale, confidence badge, price, select button. |
| `components/ProductImage.tsx` | Decides whether to show a real photo or the "Image pending verification" placeholder, based on whether that product's image has been confirmed. |
| `components/ConfidenceTag.tsx` | The small High/Medium/Low colored badge. |
| `components/QuoteView.tsx` | The quote/estimate screen. Itemized list, subtotal, disclaimer banner, non-functional "Request Formal Quote" button. |
| `components/Footer.tsx` | The plain-language disclaimer footer shown on every screen (curated demo catalog, illustrative pricing, etc.). |
| `public/templates/` | The four actual template room photos (elevation, living room, reception, washroom). |

---

## 3. Catalog status right now (exact counts, 2026-08-05)

**22 products total** across 4 categories. **0 have a human-confirmed image (`imageVerified: true`)**:
every single one still shows the "Image pending verification" placeholder in the real app, regardless of
whether a candidate photo has been found for it.

| Category | Total products | Image confirmed | Candidate image found, awaiting review | No candidate found at all |
|---|---|---|---|---|
| Lighting | 6 | 0 | 4 | 2 |
| External Facades | 6 | 0 | 6 | 0 |
| Home Hardware & Bath | 6 | 0 | 6 | 0 |
| Surface Treatments | 4 | 0 | 4 | 0 |
| **Total** | **22** | **0** | **20** | **2** |

The 2 products with no candidate at all are **"Customised Indoor Lighting"** and **"Smart Lighting"**
(both Ledlum). An automated search found no matching page or photo on Ledlum's own site for either. They
need someone to manually source a photo; there's currently nothing to review or approve for them.

The other 20 have a candidate photo sitting in `lib/catalog.ts`, found via automated web search tonight,
but **not one of them has been human-confirmed yet.** Until someone reviews and approves a candidate at
the dev-only `/review` page (see Section 5), all 22 products render as placeholders in the actual app:
this is intentional, not a bug.

---

## 4. What's real vs. what's illustrative: stated plainly

- **Product names and brands: real.** Every product traces to an actual AllHome partner brand (Ledlum,
  Metalia, The Window Factory, Fiamarc, Shapes, House of W, Colour Coats) and a real product line from
  that brand. Nothing was invented.
- **Product images: real only where confirmed, a clear placeholder otherwise.** Right now that means
  **every product** shows as a placeholder (see Section 3). None have been confirmed yet.
- **Pricing: always illustrative. Never real. Never generated by the AI model. Confirmed directly in the
  code, not just asserted here:**
  - The price shown for every product is `product.priceRangeINR`, a hand-set `[low, high]` number pair
    stored directly in `lib/catalog.ts` (for example, line 32: `priceRangeINR: [8500, 32000]`).
  - The request sent to Gemini (`app/api/analyze/route.ts`, the `candidates` object built at line 104)
    only includes `id`, `brand`, `productLine`, `description`, and `styleTags`: **price is never sent to
    the model.**
  - The response Gemini is asked to return (the `RESPONSE_SCHEMA` at line 21) only allows `id`, `rank`,
    `rationale`, and `confidence`: **there is no field for Gemini to return a price even if it wanted
    to.**
  - The quote subtotal (`components/QuoteView.tsx`, line 15) is calculated purely by averaging that
    stored `priceRangeINR` pair for each selected product and summing it. No AI involvement anywhere in
    that calculation.
  - Every screen that shows a price also shows "est." next to it, and the quote screen carries an
    explicit banner stating the pricing is a sample for demonstration, with real pricing coming from the
    AllHome team.

---

## 5. The dev-only review tool (not part of the customer-facing demo)

At `http://localhost:3000/review` (only works while running the app locally for development. This route
is disabled in production) is a plain, unstyled internal tool for reviewing the 20 candidate images found
tonight. It shows all 22 products in a grid with the candidate photo (or "No candidate found" if none
exists) and the research note explaining where that image came from. Two buttons per product: "✓
Correct" flips that product's confirmed status on directly in `lib/catalog.ts`; "✗ Wrong / no good match"
leaves it as unconfirmed. This tool writes directly to the source code file on disk, which only makes
sense during local development. It refuses to run at all in production.

---

## 6. Known limitations: honestly listed

- **No product images are confirmed yet** (0 of 22). This is the single biggest visible gap before a
  demo. Every result card currently shows a placeholder box instead of a photo.
- **2 of 22 products have no candidate image at all** and need one manually sourced (see Section 3).
- **Several of the 20 candidate images have real caveats** flagged during research. Not just "found" or
  "not found." For example, one brand's actual product line under a given name turned out to be a
  completely different product type than what's listed in our catalog. These are documented per-product
  in `lib/reviewNotes.ts` and shown on the review page, but won't be visible in the real demo app.
- **Only one template + one category combination has been tested live against the real Gemini API**
  (the living room template with the Lighting category). The other 3 templates and the other 3 categories
  have not been individually spot-checked yet.
- **The cross-sell call is not fully reliable.** During testing it failed on one run with no results
  returned (the app handled this gracefully. It just shows no cross-sell suggestion rather than
  breaking. But it's a real occasional failure mode, not hypothetical).
- **"Request Formal Quote" does nothing beyond showing a confirmation message.** No email, database
  record, or notification is created. This is intentional for this stage, not an oversight, but worth
  saying out loud before a demo so nobody clicks it expecting a real request to go out.
- **No database, no user accounts, no saved sessions.** Refreshing the page loses all selections. This
  matches the original project decision (catalog is small and static, a database wasn't worth the
  complexity) but is worth knowing going into a demo. Don't refresh mid-demo.
- **Not deployed anywhere yet.** Everything described here has only been run and tested on a local
  development machine, not on a public URL.
