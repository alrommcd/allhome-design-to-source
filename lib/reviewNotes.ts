/**
 * Dev-only research notes from the automated image search pass, keyed by
 * product id. Used solely by /app/review to give Om context while eyeballing
 * candidates — never imported by the production app or shown to end users.
 */
export const reviewNotes: Record<string, string> = {
  "ledlum-slim-magnetic-track":
    "Ledlum's site has no page literally named this; used the Indoor Series hero, whose page lists 'Slim Magnetic Track, Fixtures, Accessories' as a sub-category.",
  "ledlum-customised-indoor":
    "NO CANDIDATE FOUND. No distinct page or image on the official site beyond the generic Indoor Series hero already used elsewhere.",
  "ledlum-accent-lighting":
    "Inferred match: Artizan Series (micro spots, wall washers, downlights) is not literally labeled 'Accent Lighting' on the site.",
  "ledlum-landscape-lighting":
    "Outdoor Series hero; sub-categories include bollards, pole lights, garden spikes — landscape fixture types.",
  "ledlum-klewe-fans":
    "NAMING MISMATCH: Ledlum's actual 'Klewe' series is solar outdoor garden lighting, not fans. Their real fan line is called 'Volaris' — used that instead. Check this one carefully.",
  "ledlum-smart-lighting":
    "NO CANDIDATE FOUND. No dedicated page/image; only a buried line item ('Vision Series - Wireless Automation Drivers').",

  "metalia-parametric-facade-panels":
    "Official Metalia catalogue photo for their 'Parametric' facade system, direct match.",
  "metalia-metal-panels-kinetic":
    "Site calls this category 'Kinetic Panels', not 'Metal Panels & Kinetic Facades'.",
  "metalia-3d-designs-louvers":
    "Site splits this into separate 'Louvers' and '3D Panels' categories; used the Louvers photo.",
  "wf-glide-sliding-windows":
    "Site confirms 'Glide (sliding)' as an official window configuration name.",
  "wf-skye-skylight":
    "NAMING MISMATCH: site never uses 'Skye' — product is just called 'Skylights' / 'Retractable Skylights'.",
  "wf-balustrade-railings":
    "NAMING MISMATCH: site doesn't brand a line 'Balustrade Railings' — closest match is their 'Aluminium baluster' railing type.",

  "fiamarc-concealed-door-hardware":
    "NAMING MISMATCH: Fiamarc doesn't label anything 'DND/HAWA concealed door hardware' — image is their HAWA Concepta fold-away system.",
  "fiamarc-furniture-hardware":
    "From Fiamarc's 'Furniture Handles' page (site's actual category name), Duo Mini cabinet pull shown.",
  "shapes-designer-cabinet-handles":
    "Chrome cabinet/wardrobe pull handles from Shapes' Wardrobe Handles project page.",
  "shapes-maindoor-glassdoor-handles":
    "Shapes groups this under 'Mortice Handles', not a combined maindoor/glassdoor category; no dedicated glass-door photo found.",
  "how-thg-paris-bath-fittings":
    "THG Paris hero image only — no Tonino Lamborghini brand presence found anywhere on thw.co.in.",
  "how-bathtubs-spa":
    "House of W has no unified 'Bathtubs & Spa' page — split across brand pages; used Victoria + Albert bathtub banner.",

  "cc-wall-textures-venetian":
    "NAMING MISMATCH: site calls this 'Calceterra' / 'Wall Textures & Lime Washes', not 'Venetian'.",
  "cc-italian-wood-coatings":
    "Labeled 'Silk Texture' under the site's Wood Coatings section — good match.",
  "cc-metallic-coatings":
    "NAMING MISMATCH: no dedicated 'Metallic Coatings' image exists — used 'Persia' shimmer finish as closest proxy.",
  "cc-seamless-flooring":
    "WEAK MATCH: shows the G40 microcement finish applied to a WALL, not a floor — no dedicated flooring photo exists on site.",
};
