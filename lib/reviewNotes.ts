/**
 * Dev-only research notes from the automated image search pass, keyed by
 * product id. Used solely by /app/review to give Om context while eyeballing
 * candidates. Never imported by the production app or shown to end users.
 */
export const reviewNotes: Record<string, string> = {
  "ledlum-slim-magnetic-track":
    "Downgraded from 'representative' to 'pending' during the physical-form catalog rewrite: the previously used Indoor Series hero image doesn't clearly show a magnetic track system under the new stricter standard. Needs a fresh representative photo, ideally via generic terminology search rather than brand-specific claims.",
  "ledlum-led-cob-concealed-downlight":
    "NEW ENTRY (Led Cob Concealed Down Light Fixtures). No image research done yet.",
  "ledlum-led-linear-tube-lights":
    "NEW ENTRY (Led Linear Tube Lights). No image research done yet.",
  "ledlum-led-strip-lights-24v":
    "NEW ENTRY (Led Strip Lights 24V). No image research done yet.",
  "ledlum-led-indoor-wall-light":
    "NEW ENTRY (Led Indoor Wall Light). No image research done yet.",
  "ledlum-led-linear-mirror-lights":
    "NEW ENTRY (Led Linear Mirror Lights, Tiltable). No image research done yet.",
  "ledlum-led-surface-panel":
    "NEW ENTRY (Led Surface Panel). No image research done yet.",
  "ledlum-klewe-architectural-fans":
    "Carried forward from the old 'Klewe Premium Architectural Fans' entry: image is Ledlum's real Volaris fan line photo. Used as a representative decorative-fan image since this catalog entry no longer claims a specific Klewe-branded photo (Ledlum's actual Klewe line is solar garden lighting, not fans).",
  "ledlum-landscape-lighting":
    "Carried forward: Outdoor Series hero image, reasonable representative fit for bollards/uplighter/wall-wash fixture types.",

  "metalia-parametric-facade-panels":
    "Official Metalia catalogue photo for their 'Parametric' facade system, direct match.",
  "metalia-metal-panels-kinetic":
    "Site calls this category 'Kinetic Panels', not 'Metal Panels & Kinetic Facades'.",
  "metalia-3d-designs-louvers":
    "Site splits this into separate 'Louvers' and '3D Panels' categories; used the Louvers photo.",
  "wf-glide-sliding-windows":
    "Site confirms 'Glide (sliding)' as an official window configuration name.",
  "wf-skye-skylight":
    "NAMING MISMATCH: site never uses 'Skye'. Product is just called 'Skylights' / 'Retractable Skylights'.",
  "wf-balustrade-railings":
    "NAMING MISMATCH: site doesn't brand a line 'Balustrade Railings'. Closest match is their 'Aluminium baluster' railing type.",

  "fiamarc-concealed-door-hardware":
    "NAMING MISMATCH: Fiamarc doesn't label anything 'DND/HAWA concealed door hardware'. Image is their HAWA Concepta fold-away system.",
  "fiamarc-furniture-hardware":
    "From Fiamarc's 'Furniture Handles' page (site's actual category name), Duo Mini cabinet pull shown.",
  "shapes-designer-cabinet-handles":
    "Chrome cabinet/wardrobe pull handles from Shapes' Wardrobe Handles project page.",
  "shapes-maindoor-glassdoor-handles":
    "Shapes groups this under 'Mortice Handles', not a combined maindoor/glassdoor category; no dedicated glass-door photo found.",
  "how-thg-paris-bath-fittings":
    "THG Paris hero image only. No Tonino Lamborghini brand presence found anywhere on thw.co.in.",
  "how-bathtubs-spa":
    "House of W has no unified 'Bathtubs & Spa' page. Split across brand pages; used Victoria + Albert bathtub banner.",

  "cc-wall-textures-venetian":
    "NAMING MISMATCH: site calls this 'Calceterra' / 'Wall Textures & Lime Washes', not 'Venetian'.",
  "cc-italian-wood-coatings":
    "Labeled 'Silk Texture' under the site's Wood Coatings section. Good match.",
  "cc-metallic-coatings":
    "NAMING MISMATCH: no dedicated 'Metallic Coatings' image exists. Used 'Persia' shimmer finish as closest proxy.",
  "cc-seamless-flooring":
    "WEAK MATCH: shows the G40 microcement finish applied to a WALL, not a floor. No dedicated flooring photo exists on site.",
};
