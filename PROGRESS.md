# Progress: AllHome Design-to-Source Agent

Current state: routing restructured, 2026-08-05 (later same day). Root `/` is now a real landing page
(hero built from `public/landingpage.png`, real headline, working `Link` navigation to `/source`). The
entire tool flow (template picker through quotation) moved to `/source`, carrying a new persistent
`ToolHeader` (logo, links back to `/`) on every screen of that flow. Route map, verification detail, and
a real asset problem found and fixed (landingpage.png has marketing copy baked into the photo itself) are
in DECISIONS.md. Typecheck, lint, and build all pass; full navigation flow live-tested in a real browser.

Prior state (still current): full visual redesign - warm ivory/gold palette, Fraunces display serif, pill
buttons, sourced directly from `public/logo.png` and `public/landingpage.png` as brand references, applied
consistently across every screen including `/review`. Functionality and data logic untouched throughout.

Prior state (functional consolidation pass, still current): physical-form-only matching, three-state
image honesty system, no pricing anywhere (quotation-request flow instead), capped 1-2 results per
category, up to 2 cross-sell suggestions, facade template moved last. See DECISIONS.md for exact findings.

## Catalog snapshot (25 products, 2026-08-05)

| Category | Count | Verified | Representative | Pending |
|---|---|---|---|---|
| Lighting (Ledlum, 9 new product lines) | 9 | 0 | 2 | 7 |
| External Facades (Metalia, Window Factory) | 6 | 0 | 6 | 0 |
| Home Hardware & Bath (Fiamarc, Shapes, House of W) | 6 | 0 | 6 | 0 |
| Surface Treatments (Colour Coats) | 4 | 0 | 4 | 0 |
| **Total** | **25** | **0** | **18** | **7** |

The 7 pending lighting entries: 6 are brand-new product lines added this pass (Led Cob Concealed
Downlight, Led Linear Tube Lights, Led Strip Lights 24V, Led Indoor Wall Light, Led Linear Mirror Lights,
Led Surface Panel) with no image research done yet; 1 (Slim Magnetic Track) was deliberately downgraded
from its old image because that photo doesn't clearly show a track system under the new stricter
"representative" standard. None of the 25 are `"verified"` - that only happens through a human clicking
Correct at `/review`.

## What changed in this pass (see DECISIONS.md for full detail)

- **Matching now forces physical form, never mood.** New system prompt forbids justifying a match by
  warmth/glow/ambiance/coziness/color-temperature, and forbids using room layout to justify a *primary*
  match (that inference is now explicitly reserved for a separate cross-sell-only prompt).
- **Every catalog description rewritten** to physical form and installation type in standard industry
  terminology - this is the actual signal sent to the model, not flavor text. `styleTags` converted from
  mood words ("warm", "bohemian") to physical/installation descriptors.
- **Lighting catalog fully replaced**: old 6-entry lineup (Slim Magnetic Track, Customised Indoor,
  Accent, Landscape, Klewe fans, Smart Lighting) out; new 9-entry real Ledlum lineup in.
- **Image honesty is now three states**, not a boolean: `"verified"` (green, human-confirmed via
  `/review`) / `"representative"` (amber, a real photo of the general product type) / `"pending"` (gray,
  no photo - shows the physical description plus a "Search on Google" link built from the real brand +
  product line, always, never a dead end).
- **No pricing anywhere.** `priceRangeINR` removed from the data model entirely. Cards say "Add to
  Quotation," not "Select." The final screen is "Quotation Request" with a "Request Formal Quotation"
  button (still non-functional by design), no subtotal, no rupee symbol anywhere in the UI.
- **Results capped at 1-2 per category**, prioritizing High then Medium; if only Low exists, shows just
  the single best one.
- **Cross-sell now surfaces up to 2 suggestions** (was 1), from any unselected category.
- **Template order**: facade/exterior template moved from first to last position. Confirmed live:
  Sunset Living Room, Reception & Lounge, Powder Room Suite, Terracotta-Clad Elevation.

## Next up

- Populate representative images for the 7 pending lighting entries (6 brand-new product lines need a
  first pass, 1 needs a redo) via generic-terminology search, not brand-specific claims this time.
- Spot-check Analyze against the other 3 templates and the other 3 categories (facades, hardware,
  surfaces) - only Lighting on the living room template has been live-tested against the new prompt.
- Om reviews the 18 "representative" candidates at `/review` and clicks Correct/Pending on each.
- Deploy to Vercel, set `GEMINI_API_KEY` there, smoke-test the deployed `/api/analyze` route specifically.
- Om review of the redesign itself (this was explicitly requested as a checkpoint before considering it
  done) - screenshots taken of all 8 screens/states, described in chat, dev server left running for
  direct browser review.

## Known issues / deferred

- 7 of 25 products have no image at all yet (see catalog snapshot above) - they show the physical
  description and a Google search link, never a broken image or empty box.
- Cross-sell reliability: failed live twice earlier in testing (once on 429 quota, once on JSON
  truncation before the maxOutputTokens 3072->4096 fix). That fix is now live-verified: this pass's
  Analyze call returned 2 valid cross-sell suggestions cleanly. Always degrades gracefully either way
  (empty array, primary results unaffected), but treat as a real occasional failure mode, not eliminated.
- Gemini's free-tier daily quota (20 requests/day/model) has been exhausted multiple times this session
  across multiple API keys under what appears to be the same Google Cloud project - rotating keys within
  the same project does not reset it. Budget live testing accordingly.
- "Request Formal Quotation" does nothing beyond showing a confirmation message, by design.
- Not deployed anywhere. Everything here has only run on a local dev machine.
