import type { Product } from "./types";

/**
 * Every description is written as physical form and installation type, in standard
 * industry terminology - this is the actual matching signal sent to Gemini, not
 * flavor text. Mood/ambiance words are deliberately excluded from description,
 * styleTags, and materials, since the analyze system prompt forbids the model from
 * justifying a match by warmth, glow, or atmosphere.
 *
 * imageStatus is one of "verified" (human-confirmed real SKU photo, only ever set
 * via the /review tool), "representative" (a real photo of the general product
 * type, not a confirmed exact SKU), or "pending" (no photo found or confirmed yet).
 * Nothing in this file is currently "verified" - that only happens through /review.
 */

export const catalog: Product[] = [
  // ---- Lighting: Ledlum ----
  {
    id: "ledlum-slim-magnetic-track",
    brand: "Ledlum",
    category: "lighting",
    productLine: "Slim Magnetic Track Fixtures",
    description:
      "Slim ceiling-mounted magnetic track rail with repositionable spotlight heads that clip onto the rail and slide along its length. Track sits flush or surface-mounted; individual heads can be aimed independently.",
    styleTags: ["track-mounted", "repositionable heads", "surface or flush rail"],
    materials: ["aluminium track", "magnetic connector heads"],
    imageUrl: "PLACEHOLDER",
    imageStatus: "pending",
    sourceUrl: "https://ledlumlighting.com",
  },
  {
    id: "ledlum-led-cob-concealed-downlight",
    brand: "Ledlum",
    category: "lighting",
    productLine: "Led Cob Concealed Down Light Fixtures",
    description:
      "Small circular downlight recessed flush into the ceiling surface, with no visible housing or trim ring protruding below the ceiling plane. COB LED source sits set back inside the cutout.",
    styleTags: ["recessed", "flush-mount", "circular cutout"],
    materials: ["die-cast aluminium housing", "COB LED module"],
    imageUrl: "PLACEHOLDER",
    imageStatus: "pending",
    sourceUrl: "https://ledlumlighting.com",
  },
  {
    id: "ledlum-led-linear-tube-lights",
    brand: "Ledlum",
    category: "lighting",
    productLine: "Led Linear Tube Lights",
    description:
      "Slim cylindrical tube fixture, either surface-mounted directly to a ceiling or wall, or suspended on cables in a continuous line. The fixture body is visible along its full length.",
    styleTags: ["surface-mounted", "suspended", "linear tube"],
    materials: ["aluminium tube housing", "polycarbonate diffuser"],
    imageUrl: "PLACEHOLDER",
    imageStatus: "pending",
    sourceUrl: "https://ledlumlighting.com",
  },
  {
    id: "ledlum-led-strip-lights-24v",
    brand: "Ledlum",
    category: "lighting",
    productLine: "Led Strip Lights 24V",
    description:
      "Thin flexible LED strip installed inside a cove, channel, or recess so the strip itself stays hidden and only the indirect glow it produces is visible. Not a standalone visible fixture.",
    styleTags: ["concealed", "cove-mounted", "indirect source"],
    materials: ["flexible PCB strip", "aluminium channel profile"],
    imageUrl: "PLACEHOLDER",
    imageStatus: "pending",
    sourceUrl: "https://ledlumlighting.com",
  },
  {
    id: "ledlum-led-indoor-wall-light",
    brand: "Ledlum",
    category: "lighting",
    productLine: "Led Indoor Wall Light",
    description:
      "Wall-mounted fixture with a visible decorative housing projecting from the wall surface; light is directed outward or upward from the housing body.",
    styleTags: ["wall-mounted", "visible housing", "surface-projecting"],
    materials: ["metal housing", "opal or clear diffuser"],
    imageUrl: "PLACEHOLDER",
    imageStatus: "pending",
    sourceUrl: "https://ledlumlighting.com",
  },
  {
    id: "ledlum-led-linear-mirror-lights",
    brand: "Ledlum",
    category: "lighting",
    productLine: "Led Linear Mirror Lights – Tiltable",
    description:
      "Slim linear fixture mounted directly above or around a bathroom mirror, with a tiltable housing that can be angled to redirect the light beam.",
    styleTags: ["mirror-mounted", "tiltable", "linear profile"],
    materials: ["aluminium profile", "tiltable bracket mount"],
    imageUrl: "PLACEHOLDER",
    imageStatus: "pending",
    sourceUrl: "https://ledlumlighting.com",
  },
  {
    id: "ledlum-led-surface-panel",
    brand: "Ledlum",
    category: "lighting",
    productLine: "Led Surface Panel",
    description:
      "Flat rectangular or square panel fixture mounted flush against the ceiling surface, producing an even diffused light across the full panel face.",
    styleTags: ["surface-mounted", "flush panel", "flat profile"],
    materials: ["aluminium frame", "diffuser panel"],
    imageUrl: "PLACEHOLDER",
    imageStatus: "pending",
    sourceUrl: "https://ledlumlighting.com",
  },
  {
    id: "ledlum-klewe-architectural-fans",
    brand: "Ledlum",
    category: "lighting",
    productLine: "Klewe Architectural Fans",
    description:
      "Decorative ceiling fan with a visible statement blade design, mounted as a central ceiling fixture that combines moving blades with integrated lighting.",
    styleTags: ["ceiling-mounted", "visible blade design", "statement fixture"],
    materials: ["wood veneer blades", "brushed metal hub"],
    imageUrl: "https://d1qlyda1dsr5ui.cloudfront.net/ledlum/images/home/product/Volaris.jpeg",
    imageStatus: "representative",
    sourceUrl: "https://ledlumlighting.com",
  },
  {
    id: "ledlum-landscape-lighting",
    brand: "Ledlum",
    category: "lighting",
    productLine: "Landscape Lighting",
    description:
      "Outdoor-only fixture set: ground-level bollards, in-ground uplighters recessed into paving or soil, and wall-wash fixtures mounted low on an exterior wall to graze light upward across the surface.",
    styleTags: ["outdoor-only", "ground or wall-mounted", "sealed housing"],
    materials: ["die-cast aluminium", "IP65/IP67 sealed housing"],
    imageUrl: "https://d1qlyda1dsr5ui.cloudfront.net/ledlum/images/home/product/Outdoor.jpeg",
    imageStatus: "representative",
    sourceUrl: "https://ledlumlighting.com",
  },

  // ---- External Facades: Metalia, The Window Factory ----
  {
    id: "metalia-parametric-facade-panels",
    brand: "Metalia",
    category: "facades",
    productLine: "Parametric Facade Panels",
    description:
      "Perforated or geometrically-patterned metal screen panels with repeating cut-out shapes, mounted as a continuous cladding layer across an exterior wall.",
    styleTags: ["perforated screen", "repeating pattern", "wall-mounted cladding"],
    materials: ["perforated aluminium", "powder-coated steel"],
    imageUrl: "https://www.metaliaindia.com/products/parametric-1.jpg",
    imageStatus: "representative",
    sourceUrl: "https://metaliaindia.com",
  },
  {
    id: "metalia-metal-panels-kinetic",
    brand: "Metalia",
    category: "facades",
    productLine: "Metal Panels & Kinetic Facades",
    description:
      "Solid or moving metal cladding panels covering an exterior building surface; kinetic units rotate or shift orientation on a motorized or wind-driven mechanism.",
    styleTags: ["metal cladding", "motorized or static panels", "exterior wall-mounted"],
    materials: ["brushed stainless steel", "aluminium composite"],
    imageUrl: "https://www.metaliaindia.com/products/kinetic-panels-1.jpg",
    imageStatus: "representative",
    sourceUrl: "https://metaliaindia.com",
  },
  {
    id: "metalia-3d-designs-louvers",
    brand: "Metalia",
    category: "facades",
    productLine: "3D Designs & Louvers",
    description:
      "Angled horizontal or vertical slats projecting from the facade surface, creating a ridged shadow pattern across the wall plane.",
    styleTags: ["projecting slats", "ridged surface", "horizontal or vertical orientation"],
    materials: ["extruded aluminium louvers"],
    imageUrl: "https://www.metaliaindia.com/products/louvers-1.jpg",
    imageStatus: "representative",
    sourceUrl: "https://metaliaindia.com",
  },
  {
    id: "wf-glide-sliding-windows",
    brand: "The Window Factory",
    category: "facades",
    productLine: "Glide Sliding Windows",
    description:
      "Large glass panels sliding horizontally within a slim aluminium frame, typically sized floor-to-ceiling for a continuous glazed opening.",
    styleTags: ["sliding panel", "slim frame", "floor-to-ceiling glazing"],
    materials: ["thermally broken aluminium", "tempered glass"],
    imageUrl: "https://www.thewindowfactory.in/assets/sliding_door.jpg",
    imageStatus: "representative",
    sourceUrl: "https://thewindowfactory.in",
  },
  {
    id: "wf-skye-skylight",
    brand: "The Window Factory",
    category: "facades",
    productLine: "Skye Skylight Solutions",
    description:
      "Glass panels set into a roof or overhead structure, admitting daylight from above rather than through a vertical wall opening.",
    styleTags: ["overhead glazing", "roof-mounted", "fixed or operable"],
    materials: ["laminated safety glass", "aluminium frame"],
    imageUrl: "https://www.thewindowfactory.in/assets/outdoor_retreat.jpg",
    imageStatus: "representative",
    sourceUrl: "https://thewindowfactory.in",
  },
  {
    id: "wf-balustrade-railings",
    brand: "The Window Factory",
    category: "facades",
    productLine: "Balustrade Railings",
    description:
      "Horizontal railing with vertical posts or a glass infill panel, installed along the edge of a balcony, terrace, or stair.",
    styleTags: ["edge railing", "glass or baluster infill", "horizontal top rail"],
    materials: ["toughened glass", "stainless steel posts"],
    imageUrl: "https://www.thewindowfactory.in/assets/balcony_railing.jpg",
    imageStatus: "representative",
    sourceUrl: "https://thewindowfactory.in",
  },

  // ---- Home Hardware & Bath: Fiamarc, Shapes, House of W ----
  {
    id: "fiamarc-concealed-door-hardware",
    brand: "Fiamarc",
    category: "hardware",
    productLine: "Concealed Door Hardware",
    description:
      "Hinge and door-closing mechanisms installed hidden inside the door leaf or frame, with nothing visible on the door face when closed.",
    styleTags: ["concealed mechanism", "no visible door-face hardware", "in-frame or in-door mount"],
    materials: ["stainless steel mechanism", "concealed steel hinge"],
    imageUrl: "https://static.wixstatic.com/media/a097db_35d6443815fd47719dc51ce51c11e2c7~mv2.jpg",
    imageStatus: "representative",
    sourceUrl: "https://fiamarc.com",
  },
  {
    id: "fiamarc-furniture-hardware",
    brand: "Fiamarc",
    category: "hardware",
    productLine: "Furniture Hardware & Mechanisms",
    description:
      "Functional cabinet and drawer hardware such as hinges, lift systems, and sliding mechanisms, mounted inside the cabinet carcass and typically hidden unless the door or drawer is open.",
    styleTags: ["internal cabinet mount", "hidden when closed", "functional mechanism"],
    materials: ["nickel-plated steel"],
    imageUrl: "https://static.wixstatic.com/media/a097db_3ee274e8ff594d98a4aec89710adc007~mv2.jpg",
    imageStatus: "representative",
    sourceUrl: "https://fiamarc.com",
  },
  {
    id: "shapes-designer-cabinet-handles",
    brand: "Shapes",
    category: "hardware",
    productLine: "Designer Cabinet & Wardrobe Handles",
    description:
      "Visible pull or grip handle mounted on the face of a cabinet or wardrobe door/drawer front, projecting outward for hand contact.",
    styleTags: ["surface-mounted pull", "visible door-face handle", "cabinet or wardrobe front"],
    materials: ["stainless steel", "matte black aluminium"],
    imageUrl: "https://shapeshw.com/wp-content/uploads/2023/01/187-768x1152.jpg",
    imageStatus: "representative",
    sourceUrl: "https://shapeshw.com",
  },
  {
    id: "shapes-maindoor-glassdoor-handles",
    brand: "Shapes",
    category: "hardware",
    productLine: "Maindoor/Glassdoor Handles",
    description:
      "Larger statement handle mounted on an entry or glass door, typically a vertical bar-style pull spanning a significant portion of the door height.",
    styleTags: ["vertical bar pull", "entry or glass-door mount", "full-height statement handle"],
    materials: ["solid brass", "stainless steel"],
    imageUrl: "https://shapeshw.com/wp-content/uploads/2023/01/BELLA-4-768x512.jpg",
    imageStatus: "representative",
    sourceUrl: "https://shapeshw.com",
  },
  {
    id: "how-thg-paris-bath-fittings",
    brand: "House of W",
    category: "hardware",
    productLine: "THG Paris/Tonino Lamborghini Bath Fittings",
    description:
      "Visible tap and faucet fixtures mounted at a sink, shower, or bath, with sculptural detailing on the spout and handle bodies.",
    styleTags: ["deck or wall-mounted fitting", "visible spout and handle", "sculptural body"],
    materials: ["solid brass", "chrome and gold-tone finishes"],
    imageUrl: "https://thw.co.in/wp-content/uploads/2023/09/Untitled-4_THG.jpg",
    imageStatus: "representative",
    sourceUrl: "https://thw.co.in",
  },
  {
    id: "how-bathtubs-spa",
    brand: "House of W",
    category: "hardware",
    productLine: "Bathtubs & Spa Solutions",
    description:
      "Freestanding or built-in bathtub positioned as the visible centerpiece fixture of the bathroom, with the full tub body exposed rather than enclosed.",
    styleTags: ["freestanding or built-in tub", "exposed tub body", "centerpiece fixture"],
    materials: ["cast acrylic", "engineered stone"],
    imageUrl: "https://thw.co.in/wp-content/uploads/2023/09/HOUSE-OF-W-BANNERS_VICTORIA-AND-ALBERT.jpg",
    imageStatus: "representative",
    sourceUrl: "https://thw.co.in",
  },

  // ---- Surface Treatments: Colour Coats ----
  {
    id: "cc-wall-textures-venetian",
    brand: "Colour Coats",
    category: "surfaces",
    productLine: "Wall Textures: Venetian-style",
    description:
      "Hand-applied plaster finish on a wall surface with a visible subtle texture and sheen, distinct from the flat uniform appearance of painted walls.",
    styleTags: ["troweled plaster texture", "visible sheen", "wall-applied finish"],
    materials: ["lime plaster", "mineral pigment"],
    imageUrl: "https://www.colourcoats.com/images/int-calceterra-beige.jpg",
    imageStatus: "representative",
    sourceUrl: "https://colourcoats.com",
  },
  {
    id: "cc-italian-wood-coatings",
    brand: "Colour Coats",
    category: "surfaces",
    productLine: "Italian-Grade Wood Coatings & Polishing",
    description:
      "Glossy or matte protective finish applied to visible wood surfaces such as furniture, wall panelling, or flooring, sealing and polishing the wood grain.",
    styleTags: ["wood-surface coating", "glossy or matte sheen", "grain-visible finish"],
    materials: ["polyurethane lacquer", "natural oil finish"],
    imageUrl: "https://www.colourcoats.com/images/int-wood-panels.jpg",
    imageStatus: "representative",
    sourceUrl: "https://colourcoats.com",
  },
  {
    id: "cc-metallic-coatings",
    brand: "Colour Coats",
    category: "surfaces",
    productLine: "Metallic Coatings",
    description:
      "Wall or surface finish with a visible metallic sheen or reflective quality across the coated surface, distinct from a flat matte paint finish.",
    styleTags: ["metallic sheen", "reflective surface", "wall-applied coating"],
    materials: ["mica pigment coating", "epoxy sealant"],
    imageUrl: "https://www.colourcoats.com/images/int-persia-purple.jpg",
    imageStatus: "representative",
    sourceUrl: "https://colourcoats.com",
  },
  {
    id: "cc-seamless-flooring",
    brand: "Colour Coats",
    category: "surfaces",
    productLine: "Seamless Flooring",
    description:
      "Continuous joint-free floor surface poured and finished as a single uniform plane, without visible tile lines or seams.",
    styleTags: ["joint-free floor surface", "poured finish", "uniform plane"],
    materials: ["epoxy resin", "micro-cement"],
    imageUrl: "https://www.colourcoats.com/images/int-g40-blue.jpg",
    imageStatus: "representative",
    sourceUrl: "https://colourcoats.com",
  },
];

export function getCatalogByCategory(category: Product["category"]): Product[] {
  return catalog.filter((product) => product.category === category);
}

export function getProductById(id: string): Product | undefined {
  return catalog.find((product) => product.id === id);
}

export function buildImageSearchUrl(brand: string, productLine: string): string {
  const query = `${brand} ${productLine}`;
  return `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`;
}
