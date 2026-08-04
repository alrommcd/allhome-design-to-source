# Progress: AllHome Design-to-Source Agent

Current state: MVP is built and runs locally (`npm run dev`, http://localhost:3000). Template picker,
category selector, Analyze flow, results panel with confidence tiers, collapsed cross-sell section, and
the Sample Estimate / quote screen are all wired up. Typecheck, lint, and production build all pass.

Last completed: Live end-to-end verification, 2026-08-05. Ran `/api/analyze` against the real Gemini API
with a real key, the actual livingroom.png template, and the "lighting" category. Found and fixed a real
bug in the process: `maxOutputTokens: 1000` truncated responses mid-JSON because Gemini 3.5's hidden
thinking tokens count against that budget — raised to 3072. Also found and fixed a silent-failure bug in
the cross-sell catch block (no logging on error). Re-verified after both fixes: primary ranking and
cross-sell both return complete, valid, image-grounded results. Typecheck/lint/build all still pass.

Four real template renders (elevation.png, livingroom.png, reception.png, washroom.png) are live in
/public/templates — no placeholder templates remain. Catalog has all 24 real seed products across the 4
categories; every product image is still `PLACEHOLDER` / `imageVerified: false` pending Om opening each
brand source page and confirming a real photo.

Next up:
- Human-verify product images per the leads listed at the top of `lib/catalog.ts`, flip `imageVerified`
  to `true` and swap in real `imageUrl`s as they're confirmed, starting with whatever brands appear in
  the four templates already in place.
- Spot-check Analyze against the other 3 templates (elevation, reception, washroom) and the other 3
  categories — only lighting on livingroom.png has been live-tested so far.
- Verify `gemini-3.5-flash` still holds by the time this ships — Google renames these often.
- Deploy to Vercel, set `GEMINI_API_KEY` there, smoke-test the deployed `/api/analyze` route specifically
  (serverless cold starts / env var scoping are the most common thing that silently breaks between local
  and prod).

Known issues / deferred:
- No product images are verified yet — every result card currently renders the "Image pending
  verification" placeholder state by design.
- Cross-sell suggestion (`crossSell` in the API response) issues one extra Gemini call across all
  unselected categories combined and takes its top-ranked pick — not explicitly speced in exact mechanism,
  built as the simplest implementation that satisfies "at most one cross-sell suggestion." One live test
  run saw this call fail transiently (no crossSell returned); the route degrades gracefully to `null`
  rather than failing the whole request, but this is a real latency/reliability characteristic to expect,
  not just a hypothetical.
- "Request Formal Quote" is a non-functional CTA by design (per spec) — it only flips local UI state.
