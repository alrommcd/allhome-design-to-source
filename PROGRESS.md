# Progress: AllHome Design-to-Source Agent

Current state: MVP is built, runs locally (`npm run dev`, http://localhost:3000), and has been verified
end to end in a real browser (Playwright), not just via curl. `ARCHITECTURE.md` documents the full system
for a non-engineer. Template picker, category selector, Analyze flow, results panel with confidence tiers,
collapsed cross-sell section, and the Sample Estimate / quote screen are all wired up and confirmed
working live against the real Gemini API. Typecheck, lint, and production build all pass.

2026-08-05, later same session: full browser-driven smoke test (living room template, Lighting category)
found everything worked end to end (6 ranked cards, correct 2 High / 2 Medium / 2 Low confidence split,
"Closest available match" framing only on Medium/Low, cross-sell correctly surfaced Window Factory sliding
windows for the visible glass doors, quote math checked out exactly). It also found 11 em dashes across UI
copy and catalog data, a direct violation of CLAUDE.md's hard rule, now fixed everywhere (code, docs
included). See DECISIONS.md for the full list of what broke and what didn't.

Last completed: Live end-to-end verification, 2026-08-05. Ran `/api/analyze` against the real Gemini API
with a real key, the actual livingroom.png template, and the "lighting" category. Found and fixed a real
bug in the process: `maxOutputTokens: 1000` truncated responses mid-JSON because Gemini 3.5's hidden
thinking tokens count against that budget. Raised to 3072. Also found and fixed a silent-failure bug in
the cross-sell catch block (no logging on error). Re-verified after both fixes: primary ranking and
cross-sell both return complete, valid, image-grounded results. Typecheck/lint/build all still pass.

Four real template renders (elevation.png, livingroom.png, reception.png, washroom.png) are live in
/public/templates. No placeholder templates remain. Catalog has all 22 real seed products across the 4
categories (6 lighting, 6 facades, 6 hardware, 4 surfaces. Corrected from an earlier miscount of "24" in
this file, PROGRESS.md, and prior commit messages; the array itself was always right, only the prose
describing it was wrong).

2026-08-05, later same session: ran the automated image-search pass ("[Brand] [Product Line] India" via
4 parallel research agents) across all 22 products and populated `imageUrl` for 20 of them: 2 came back
with no confident candidate (`ledlum-customised-indoor`, `ledlum-smart-lighting`). `imageVerified` stays
`false` on all 22; nothing is confirmed until a human clicks through it. Research notes (including several
real brand-naming mismatches, e.g. Ledlum's actual fan line is "Volaris" not "Klewe") live in
`lib/reviewNotes.ts`, keyed by product id, imported only by the new review tool. Built a dev-only
`/review` page (`app/review/page.tsx` + `components/dev/ReviewGrid.tsx`) plus
`app/api/dev/verify-image` (POST `{id, verified}`, writes `imageVerified` directly into `lib/catalog.ts`
on disk, blocked in production) so Om can click through all 22 and confirm or reject each candidate.
Switched `ProductImage.tsx` off `next/image` to a plain `<img>` in the process, since candidate images
come from arbitrary brand domains next/image would otherwise refuse to render without an explicit
`remotePatterns` allowlist entry per host.

Next up:
- Om reviews all 22 candidates at `/review` (dev server only) and clicks Correct/Wrong on each.
- The 2 products with no candidate (`ledlum-customised-indoor`, `ledlum-smart-lighting`) still need a
  manually-sourced image. The automated search found nothing on Ledlum's site to match either.
- Spot-check Analyze against the other 3 templates (elevation, reception, washroom) and the other 3
  categories. Only lighting on livingroom.png has been live-tested so far.
- Verify `gemini-3.5-flash` still holds by the time this ships: Google renames these often.
- Deploy to Vercel, set `GEMINI_API_KEY` there, smoke-test the deployed `/api/analyze` route specifically
  (serverless cold starts / env var scoping are the most common thing that silently breaks between local
  and prod).

Known issues / deferred:
- No product images are verified yet. Every result card currently renders the "Image pending
  verification" placeholder state by design, regardless of whether `imageUrl` now holds a candidate.
- Several candidate images found tonight are flagged in `lib/reviewNotes.ts` as naming mismatches or weak
  matches (e.g. Colour Coats "Seamless Flooring" candidate actually shows the finish on a wall, not a
  floor). Worth reading the note before clicking Correct, not just eyeballing the photo.
- Cross-sell suggestion (`crossSell` in the API response) issues one extra Gemini call across all
  unselected categories combined and takes its top-ranked pick. Not explicitly speced in exact mechanism,
  built as the simplest implementation that satisfies "at most one cross-sell suggestion." One live test
  run saw this call fail transiently (no crossSell returned); the route degrades gracefully to `null`
  rather than failing the whole request, but this is a real latency/reliability characteristic to expect,
  not just a hypothetical.
- "Request Formal Quote" is a non-functional CTA by design (per spec). It only flips local UI state.
