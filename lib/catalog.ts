import type { Product } from "./types";

/**
 * Every entry ships as imageUrl: "PLACEHOLDER", imageVerified: false until a
 * human opens the brand source page and confirms the image actually matches
 * the product. Leads to check (from research, not yet verified):
 *   Ledlum    -> ledlumlighting.com product listings
 *   Metalia   -> metaliaindia.com "Our Products"
 *   Fiamarc   -> fiamarc.com "Solutions" (Door Hinges, Door Handles, Furniture Handles)
 *   Shapes    -> shapeshw.com
 *   House of W -> thw.co.in (THG Paris / Tonino Lamborghini partner pages)
 *   Colour Coats -> colourcoats.com
 *   Window Factory AllHome gallery filenames (self-descriptive, higher confidence
 *   once opened): casement_window.jpg, glide_1.jpg, vertical_sliding.jpg,
 *   outdoor_retreat_1.jpg, outdoor_retreat_2.jpg, solaglide.jpg
 * Flip imageVerified to true and swap imageUrl only after visual confirmation.
 */

export const catalog: Product[] = [
  // ---- Lighting: Ledlum ----
  {
    id: "ledlum-slim-magnetic-track",
    brand: "Ledlum",
    category: "lighting",
    productLine: "Slim Magnetic Track Fixtures & Accessories",
    description:
      "Ultra-slim magnetic track system with modular spotlights, linear diffusers, and pendant accessories that snap onto a single low-profile rail. Built for ceilings that want continuous, adjustable light without visible fixtures breaking up the plane.",
    styleTags: ["minimalist", "modern"],
    materials: ["brushed aluminium", "matte black powder coat"],
    imageUrl: "https://d1qlyda1dsr5ui.cloudfront.net/ledlum/images/home/product/Indoor.jpeg",
    imageVerified: false,
    priceRangeINR: [8500, 32000],
    sourceUrl: "https://ledlumlighting.com",
  },
  {
    id: "ledlum-customised-indoor",
    brand: "Ledlum",
    category: "lighting",
    productLine: "Customised Indoor Lighting",
    description:
      "Made-to-spec indoor fixtures, from cove lighting profiles to sculptural pendants, sized and finished to a room's exact geometry. Sits comfortably in layered, contemporary interiors that mix ambient and task lighting.",
    styleTags: ["contemporary"],
    materials: ["aluminium", "opal acrylic diffuser"],
    imageUrl: "PLACEHOLDER",
    imageVerified: false,
    priceRangeINR: [12000, 65000],
    sourceUrl: "https://ledlumlighting.com",
  },
  {
    id: "ledlum-accent-lighting",
    brand: "Ledlum",
    category: "lighting",
    productLine: "Accent Lighting",
    description:
      "Warm-toned accent fixtures, wall washers, and picture lights designed to highlight texture and material rather than flood a room. Reads traditional and layered, suited to spaces with visible wood, stone, or textile detail.",
    styleTags: ["traditional", "warm"],
    materials: ["brass", "antique bronze finish"],
    imageUrl: "https://d1qlyda1dsr5ui.cloudfront.net/ledlum/images/home/product/Artizan.jpeg",
    imageVerified: false,
    priceRangeINR: [4500, 18000],
    sourceUrl: "https://ledlumlighting.com",
  },
  {
    id: "ledlum-landscape-lighting",
    brand: "Ledlum",
    category: "lighting",
    productLine: "Landscape Lighting",
    description:
      "Weatherproof exterior fixtures, uplights, and path lights for facades, gardens, and outdoor walkways. Emphasizes architectural edges and planting rather than broad floodlight coverage.",
    styleTags: ["outdoor", "architectural"],
    materials: ["die-cast aluminium", "IP65 sealed housing"],
    imageUrl: "https://d1qlyda1dsr5ui.cloudfront.net/ledlum/images/home/product/Outdoor.jpeg",
    imageVerified: false,
    priceRangeINR: [3000, 22000],
    sourceUrl: "https://ledlumlighting.com",
  },
  {
    id: "ledlum-klewe-fans",
    brand: "Ledlum",
    category: "lighting",
    productLine: "Klewe Premium Architectural Fans",
    description:
      "Statement ceiling fans with sculptural blade forms and integrated lighting, meant to function as a room's focal object rather than a hidden utility. Pairs well with eclectic, layered, globally-referenced interiors.",
    styleTags: ["bohemian", "statement"],
    materials: ["wood veneer blades", "brushed brass hub"],
    imageUrl: "https://d1qlyda1dsr5ui.cloudfront.net/ledlum/images/home/product/Volaris.jpeg",
    imageVerified: false,
    priceRangeINR: [28000, 95000],
    sourceUrl: "https://ledlumlighting.com",
  },
  {
    id: "ledlum-smart-lighting",
    brand: "Ledlum",
    category: "lighting",
    productLine: "Smart Lighting",
    description:
      "App and voice-controllable fixtures with tunable colour temperature, built into clean cylindrical or track-mounted housings. Fits industrial-modern spaces where the fixture itself stays visually quiet.",
    styleTags: ["modern", "industrial"],
    materials: ["anodised aluminium", "matte black steel"],
    imageUrl: "PLACEHOLDER",
    imageVerified: false,
    priceRangeINR: [6000, 40000],
    sourceUrl: "https://ledlumlighting.com",
  },

  // ---- External Facades: Metalia, The Window Factory ----
  {
    id: "metalia-parametric-facade-panels",
    brand: "Metalia",
    category: "facades",
    productLine: "Parametric Facade Panels",
    description:
      "Computationally-patterned metal cladding panels with repeating geometric perforation, used to wrap building exteriors in a single continuous rhythm. Reads as heavy industrial precision at facade scale.",
    styleTags: ["industrial", "modern"],
    materials: ["perforated aluminium", "powder-coated steel"],
    imageUrl: "https://www.metaliaindia.com/products/parametric-1.jpg",
    imageVerified: false,
    priceRangeINR: [45000, 180000],
    sourceUrl: "https://metaliaindia.com",
  },
  {
    id: "metalia-metal-panels-kinetic",
    brand: "Metalia",
    category: "facades",
    productLine: "Metal Panels & Kinetic Facades",
    description:
      "Motorised or wind-responsive metal facade elements that shift orientation across the day, built for buildings that want a moving, statement exterior rather than a static skin.",
    styleTags: ["industrial", "statement"],
    materials: ["brushed stainless steel", "aluminium composite"],
    imageUrl: "https://www.metaliaindia.com/products/kinetic-panels-1.jpg",
    imageVerified: false,
    priceRangeINR: [90000, 350000],
    sourceUrl: "https://metaliaindia.com",
  },
  {
    id: "metalia-3d-designs-louvers",
    brand: "Metalia",
    category: "facades",
    productLine: "3D Designs & Louvers",
    description:
      "Angled metal louver systems and dimensional relief panels used for shading and visual texture on modern facades, with a strong horizontal or vertical line language.",
    styleTags: ["modern"],
    materials: ["extruded aluminium louvers"],
    imageUrl: "https://www.metaliaindia.com/products/louvers-1.jpg",
    imageVerified: false,
    priceRangeINR: [35000, 140000],
    sourceUrl: "https://metaliaindia.com",
  },
  {
    id: "wf-glide-sliding-windows",
    brand: "The Window Factory",
    category: "facades",
    productLine: "Glide Sliding Windows",
    description:
      "Slim-profile aluminium sliding window systems built for large, uninterrupted glass openings. Suited to minimalist elevations where the frame all but disappears against the glazing.",
    styleTags: ["minimalist", "contemporary"],
    materials: ["thermally broken aluminium", "tempered glass"],
    imageUrl: "https://www.thewindowfactory.in/assets/sliding_door.jpg",
    imageVerified: false,
    priceRangeINR: [28000, 95000],
    sourceUrl: "https://thewindowfactory.in",
  },
  {
    id: "wf-skye-skylight",
    brand: "The Window Factory",
    category: "facades",
    productLine: "Skye Skylight Solutions",
    description:
      "Fixed and operable roof glazing systems that bring overhead daylight into deep interior plans, detailed to sit flush with modern roof lines.",
    styleTags: ["modern"],
    materials: ["laminated safety glass", "aluminium frame"],
    imageUrl: "https://www.thewindowfactory.in/assets/outdoor_retreat.jpg",
    imageVerified: false,
    priceRangeINR: [40000, 160000],
    sourceUrl: "https://thewindowfactory.in",
  },
  {
    id: "wf-balustrade-railings",
    brand: "The Window Factory",
    category: "facades",
    productLine: "Balustrade Railings",
    description:
      "Frameless or slim-post glass balustrade systems for balconies, terraces, and stair edges, keeping sightlines open on contemporary facades.",
    styleTags: ["contemporary"],
    materials: ["toughened glass", "stainless steel posts"],
    imageUrl: "https://www.thewindowfactory.in/assets/balcony_railing.jpg",
    imageVerified: false,
    priceRangeINR: [15000, 60000],
    sourceUrl: "https://thewindowfactory.in",
  },

  // ---- Home Hardware & Bath: Fiamarc, Shapes, House of W ----
  {
    id: "fiamarc-concealed-door-hardware",
    brand: "Fiamarc",
    category: "hardware",
    productLine: "Concealed Door Hardware — DND/HAWA systems",
    description:
      "Hidden hinge and door-closing mechanisms that leave no visible hardware on the door face, built for flush, seamless door details in pared-back interiors.",
    styleTags: ["minimalist", "modern"],
    materials: ["stainless steel mechanism", "concealed steel hinge"],
    imageUrl: "https://static.wixstatic.com/media/a097db_35d6443815fd47719dc51ce51c11e2c7~mv2.jpg",
    imageVerified: false,
    priceRangeINR: [3500, 14000],
    sourceUrl: "https://fiamarc.com",
  },
  {
    id: "fiamarc-furniture-hardware",
    brand: "Fiamarc",
    category: "hardware",
    productLine: "Furniture Hardware & Mechanisms",
    description:
      "Soft-close hinges, lift systems, and sliding mechanisms for cabinetry and wardrobes, engineered to disappear into modern joinery.",
    styleTags: ["modern"],
    materials: ["nickel-plated steel"],
    imageUrl: "https://static.wixstatic.com/media/a097db_3ee274e8ff594d98a4aec89710adc007~mv2.jpg",
    imageVerified: false,
    priceRangeINR: [1200, 8000],
    sourceUrl: "https://fiamarc.com",
  },
  {
    id: "shapes-designer-cabinet-handles",
    brand: "Shapes",
    category: "hardware",
    productLine: "Designer Cabinet & Wardrobe Handles",
    description:
      "Slim, sculptural pull handles for cabinetry and wardrobes in restrained geometric profiles, meant to read as a quiet architectural detail rather than a decorative flourish.",
    styleTags: ["contemporary", "minimalist"],
    materials: ["stainless steel", "matte black aluminium"],
    imageUrl: "https://shapeshw.com/wp-content/uploads/2023/01/187-768x1152.jpg",
    imageVerified: false,
    priceRangeINR: [800, 4500],
    sourceUrl: "https://shapeshw.com",
  },
  {
    id: "shapes-maindoor-glassdoor-handles",
    brand: "Shapes",
    category: "hardware",
    productLine: "Maindoor/Glassdoor Handles",
    description:
      "Substantial entry-door pull handles, from sculpted traditional profiles to oversized statement bars, designed to be the first tactile impression of a home.",
    styleTags: ["statement", "traditional"],
    materials: ["solid brass", "stainless steel"],
    imageUrl: "https://shapeshw.com/wp-content/uploads/2023/01/BELLA-4-768x512.jpg",
    imageVerified: false,
    priceRangeINR: [5000, 35000],
    sourceUrl: "https://shapeshw.com",
  },
  {
    id: "how-thg-paris-bath-fittings",
    brand: "House of W",
    category: "hardware",
    productLine: "THG Paris / Tonino Lamborghini Bath Fittings",
    description:
      "High-end European bath fittings, from sculpted faucets to finished shower systems, distributed through House of W's designer-brand partnerships. Built for interiors that treat the bathroom as a considered, finished room rather than a utility space.",
    styleTags: ["luxury", "traditional"],
    materials: ["solid brass", "chrome and gold-tone finishes"],
    imageUrl: "https://thw.co.in/wp-content/uploads/2023/09/Untitled-4_THG.jpg",
    imageVerified: false,
    priceRangeINR: [45000, 250000],
    sourceUrl: "https://thw.co.in",
  },
  {
    id: "how-bathtubs-spa",
    brand: "House of W",
    category: "hardware",
    productLine: "Bathtubs & Spa Solutions",
    description:
      "Freestanding and built-in tubs plus spa systems positioned as the centrepiece of a luxury bathroom, sculptural enough to work as the room's primary visual object.",
    styleTags: ["luxury"],
    materials: ["cast acrylic", "engineered stone"],
    imageUrl: "https://thw.co.in/wp-content/uploads/2023/09/HOUSE-OF-W-BANNERS_VICTORIA-AND-ALBERT.jpg",
    imageVerified: false,
    priceRangeINR: [80000, 400000],
    sourceUrl: "https://thw.co.in",
  },

  // ---- Surface Treatments: Colour Coats ----
  {
    id: "cc-wall-textures-venetian",
    brand: "Colour Coats",
    category: "surfaces",
    productLine: "Wall Textures — Venetian-style finishes",
    description:
      "Hand-applied plaster finishes with a soft, marbled sheen, built up in layers for depth rather than a flat painted coat. Suited to rooms leaning into handcrafted, earthy, lived-in texture.",
    styleTags: ["bohemian", "earthy"],
    materials: ["lime plaster", "mineral pigment"],
    imageUrl: "https://www.colourcoats.com/images/int-calceterra-beige.jpg",
    imageVerified: false,
    priceRangeINR: [180, 650],
    sourceUrl: "https://colourcoats.com",
  },
  {
    id: "cc-italian-wood-coatings",
    brand: "Colour Coats",
    category: "surfaces",
    productLine: "Italian-Grade Wood Coatings & Polishing",
    description:
      "High-grade lacquers and polishing systems for timber floors, panelling, and furniture, giving warm woods a deep, traditional hand-finished sheen.",
    styleTags: ["traditional", "warm"],
    materials: ["polyurethane lacquer", "natural oil finish"],
    imageUrl: "https://www.colourcoats.com/images/int-wood-panels.jpg",
    imageVerified: false,
    priceRangeINR: [220, 900],
    sourceUrl: "https://colourcoats.com",
  },
  {
    id: "cc-metallic-coatings",
    brand: "Colour Coats",
    category: "surfaces",
    productLine: "Metallic Coatings",
    description:
      "Reflective metallic wall and surface finishes in bronze, pewter, and gunmetal tones, applied for a bold, statement surface rather than a neutral backdrop.",
    styleTags: ["statement", "modern"],
    materials: ["mica pigment coating", "epoxy sealant"],
    imageUrl: "https://www.colourcoats.com/images/int-persia-purple.jpg",
    imageVerified: false,
    priceRangeINR: [350, 1200],
    sourceUrl: "https://colourcoats.com",
  },
  {
    id: "cc-seamless-flooring",
    brand: "Colour Coats",
    category: "surfaces",
    productLine: "Seamless Flooring",
    description:
      "Poured, joint-free epoxy and micro-cement flooring systems that read as one continuous plane across a room, favoured in pared-back minimalist and modern interiors.",
    styleTags: ["minimalist", "modern"],
    materials: ["epoxy resin", "micro-cement"],
    imageUrl: "https://www.colourcoats.com/images/int-g40-blue.jpg",
    imageVerified: false,
    priceRangeINR: [280, 950],
    sourceUrl: "https://colourcoats.com",
  },
];

export function getCatalogByCategory(category: Product["category"]): Product[] {
  return catalog.filter((product) => product.category === category);
}

export function getProductById(id: string): Product | undefined {
  return catalog.find((product) => product.id === id);
}
