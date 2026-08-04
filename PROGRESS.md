# Progress: AllHome Design-to-Source Agent

Current state: MVP is built and runs locally (`npm run dev`, http://localhost:3000). Template picker,
category selector, Analyze flow, results panel with confidence tiers, collapsed cross-sell section, and
the Sample Estimate / quote screen are all wired up. Typecheck, lint, and production build all pass.

Last completed: Full build pass, 2026-08-04. Four real template renders (elevation.png, livingroom.png,
reception.png, washroom.png) are live in /public/templates — no placeholder templates remain. Catalog has
all 24 real seed products across the 4 categories; every product image is still `PLACEHOLDER` /
`imageVerified: false` pending Om opening each brand source page and confirming a real photo.

Next up:
- Add `GEMINI_API_KEY` to `.env.local` and run a real end-to-end Analyze call (never done live yet — the
  route logic was verified via a missing-key error response, not a real Gemini call).
- Verify `gemini-3.5-flash` (confirmed as the current GA flash model on 2026-08-04) still holds by the
  time this ships — Google renames these often.
- Human-verify product images per the leads listed at the top of `lib/catalog.ts`, flip `imageVerified`
  to `true` and swap in real `imageUrl`s as they're confirmed, starting with whatever brands appear in
  the four templates already in place.
- Deploy to Vercel, set `GEMINI_API_KEY` there, smoke-test the deployed `/api/analyze` route specifically
  (serverless cold starts / env var scoping are the most common thing that silently breaks between local
  and prod).

Known issues / deferred:
- No product images are verified yet — every result card currently renders the "Image pending
  verification" placeholder state by design.
- Cross-sell suggestion (`crossSell` in the API response) issues one extra Gemini call across all
  unselected categories combined and takes its top-ranked pick — not explicitly speced in exact mechanism,
  built as the simplest implementation that satisfies "at most one cross-sell suggestion."
- "Request Formal Quote" is a non-functional CTA by design (per spec) — it only flips local UI state.
