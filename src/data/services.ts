export interface SubServiceItem {
  number: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface ServiceCategory {
  slug: string;
  number: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  introLabel: string;
  subServices: SubServiceItem[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    slug: "architecture",
    number: "01",
    title: "ARCHITECTURE",
    description:
      "Innovative architectural solutions that balance aesthetics, functionality and practical requirements.",
    image: "/images/services/architecture.webp",
    imageAlt:
      "Contemporary architectural residence with warm travertine stone, charcoal louvers, and timber soffit",
    introLabel: "ARCHITECTURAL SERVICES",
    subServices: [
      {
        number: "01",
        title: "ARCHITECTURAL PLANNING",
        description:
          "Strategic site-responsive planning that evaluates orientation, natural light, zoning parameters, circulation flow, and spatial relationships to lay a clear foundation for enduring architecture.",
        image: "/images/services/arch-planning.webp",
        imageAlt:
          "Elevated architectural perspective overlooking terraced travertine courts, reflecting water, and structured landscape geometry",
      },
      {
        number: "02",
        title: "CONCEPT DEVELOPMENT",
        description:
          "Translating client aspirations and site context into compelling architectural massing, tactile material palettes, and distinctive spatial narratives from early studies onward.",
        image: "/images/services/arch-concept.webp",
        imageAlt:
          "Minimalist architectural scale massing model crafted from pale basswood, travertine stone, and matte charcoal accents",
      },
      {
        number: "03",
        title: "BUILDING DESIGN",
        description:
          "Comprehensive architectural design uniting structural expression, refined facade detailing, climate responsiveness, and precise technical documentation.",
        image: "/images/services/building-design-4k.webp",
        imageAlt:
          "Contemporary two-story residential building featuring cantilevered slabs, charcoal trim, illuminated columns, and landscaped courtyard",
      },
      {
        number: "04",
        title: "SPACE PLANNING",
        description:
          "Human-centered interior zoning crafted for effortless daily movement, natural ventilation, acoustic calm, and balanced indoor-outdoor proportions.",
        image: "/images/services/space-planning-4k.webp",
        imageAlt:
          "Contemporary single-story residence with stone column, warm timber soffit, glass terrace window, covered carport, and illuminated entrance steps",
      },
      {
        number: "05",
        title: "3D ARCHITECTURAL VISUALISATION",
        description:
          "Photorealistic architectural imagery, twilight lighting studies, and spatial previews that let clients experience proportions and materials before construction begins.",
        image: "/images/services/3d-visualisation-4k.webp",
        imageAlt:
          "Detailed architectural 3D scale model on a wooden design studio workbench with illuminated interior spaces and landscaped terraces",
      },
    ],
  },
  {
    slug: "interior-design",
    number: "02",
    title: "INTERIOR DESIGN",
    description:
      "Thoughtfully designed interior spaces that reflect individual lifestyles and business requirements.",
    image: "/images/services/interior-design.webp",
    imageAlt:
      "Minimalist luxury interior featuring warm oak paneling, travertine stone table, and natural light",
    introLabel: "INTERIOR SERVICES",
    subServices: [
      {
        number: "01",
        title: "RESIDENTIAL INTERIOR DESIGN",
        description:
          "Warm, refined living environments tailored around daily routines, natural daylight, custom proportions, and enduring material comfort.",
        image: "/images/services/residential-interior-4k.webp",
        imageAlt:
          "Modern luxury residential living room with recessed warm cove ceiling, beige sectional sofa, draped panoramic window, glossy cream coffee table, floating media console, ottoman, and polished tile floor",
      },
      {
        number: "02",
        title: "COMMERCIAL INTERIOR DESIGN",
        description:
          "Purpose-built workspaces, studios, and hospitality interiors designed to express brand identity while elevating client and team experience.",
        image: "/images/services/turnkey-solutions.webp",
        imageAlt:
          "Contemporary architectural studio lounge opening onto a calm courtyard terrace",
      },
      {
        number: "03",
        title: "SPACE OPTIMISATION",
        description:
          "Intelligent interior planning that unlocks usable square footage, streamlines movement, integrates concealed storage, and enhances spatial clarity.",
        image: "/images/services/space-optimisation-4k.webp",
        imageAlt:
          "Open-plan modern kitchen and living zone with fluted timber island, recessed cove ceiling, backlit display cabinetry, veined marble floor inlay, and clear architectural circulation",
      },
      {
        number: "04",
        title: "MATERIAL AND FURNITURE SELECTION",
        description:
          "Curated natural stones, warm timber finishes, bespoke cabinetry, and architectural furnishings unified into a calm, tactile palette.",
        image: "/images/services/material-furniture-4k.webp",
        imageAlt:
          "Luxury curated living room showcasing emerald velvet sectional sofa, veined marble plinth table with brass base, charcoal swivel chair, organic bronze mirror, amber marble wall art, and cascading glass chandelier",
      },
      {
        number: "05",
        title: "LIGHTING AND AESTHETIC DESIGN",
        description:
          "Layered recessed, cove, and accent illumination paired with balanced tonal styling that brings warmth and architectural depth from day to evening.",
        image: "/images/services/lighting-aesthetic-4k.webp",
        imageAlt:
          "Architectural living interior with warm backlit TV panel on vertical timber slats, illuminated glass bar vitrine cabinet, cove-lit kitchen passage, and sheer-curtained daylight window",
      },
    ],
  },
  {
    slug: "project-construction",
    number: "03",
    title: "PROJECT CONSTRUCTION",
    description:
      "Professional construction services focused on quality, planning and efficient execution.",
    image: "/images/services/project-construction.webp",
    imageAlt:
      "Architectural construction in progress showing fair-faced concrete columns, steel beams, and timber ceiling",
    introLabel: "CONSTRUCTION SERVICES",
    subServices: [
      {
        number: "01",
        title: "CONSTRUCTION PLANNING",
        description:
          "Detailed work-breakdown schedules, resource forecasting, structural sequencing, and disciplined milestone tracking prior to breaking ground.",
        image: "/images/services/construction-planning-4k.webp",
        imageAlt:
          "Architectural blueprints, tape measure, and yellow hard hat on a site table overlooking an active two-story villa transitioning from concrete formwork to finished stucco and glazing",
      },
      {
        number: "02",
        title: "RESIDENTIAL AND COMMERCIAL CONSTRUCTION",
        description:
          "Full-scale civil and structural building delivery for bespoke villas, modern residences, and commercial developments built to lasting standards.",
        image: "/images/services/commercial-construction-4k.webp",
        imageAlt:
          "Multi-story commercial building under construction featuring angled roof overhang, glass curtain wall, concrete column scaffolding, tower cranes, and foreground structural staging yard",
      },
      {
        number: "03",
        title: "SITE EXECUTION",
        description:
          "Hands-on on-site engineering oversight managing excavation, structural concrete, masonry, glazing installation, and finishing trades with precision.",
        image: "/images/services/site-execution-wide-4k.webp",
        imageAlt:
          "Executed U-shaped modern two-story residence featuring crisp stone cladding, vertical cedar soffits, full-height dark-framed glazing, curved glass balcony balustrades, and courtyard reflecting pool",
      },
      {
        number: "04",
        title: "PROJECT COORDINATION",
        description:
          "Seamless alignment between architects, structural consultants, MEP contractors, and specialized craftsmen to avoid delays and rework.",
        image: "/images/services/project-coordination-4k.webp",
        imageAlt:
          "Architectural wireframe-to-render study of a multi-level hillside villa illustrating structural sequencing, interior buildout, stone retaining walls, terraces, and reflecting pool",
      },
      {
        number: "05",
        title: "CONSTRUCTION QUALITY MANAGEMENT",
        description:
          "Rigorous material testing, alignment tolerance checks, waterproofing audits, and stage-wise technical sign-offs guaranteeing durable craftsmanship.",
        image: "/images/services/construction-quality-full-4k.webp",
        imageAlt:
          "Luxury bathroom finished with book-matched blue-and-gold veined porcelain slabs across walls and floor, dual brass-framed mirrors and vanities, pendant lighting, and sculptural freestanding soaking tub",
      },
    ],
  },
  {
    slug: "turnkey-solutions",
    number: "04",
    title: "TURNKEY SOLUTIONS",
    description:
      "Complete end-to-end project execution, from initial concept to final handover.",
    image: "/images/services/turnkey-solutions.webp",
    imageAlt:
      "Completed modern residence terrace and warm illuminated living pavilion at golden hour",
    introLabel: "TURNKEY DELIVERY",
    subServices: [
      {
        number: "01",
        title: "DESIGN AND PLANNING",
        description:
          "Integrated architectural concepts, interior layouts, engineering drawings, and budget alignment crafted under one unified vision from day one.",
        image: "/images/services/turnkey-design-planning-4k.webp",
        imageAlt:
          "Tailored living lounge featuring teal recessed wall molding, fluted backlit TV unit, backlit shelving, deep teal velvet seating, and open dining flow",
      },
      {
        number: "02",
        title: "MATERIAL PROCUREMENT",
        description:
          "Direct sourcing, sample validation, vendor scheduling, and transparent supply-chain management for stones, timber, fixtures, and hardware.",
        image: "/images/services/turnkey-procur-4k.webp",
        imageAlt:
          "Modern living and dining residence showcasing sourced dark engineered timber flooring, tailored cream upholstery, warm cove lighting, draped glazing, and minimalist media cabinetry",
      },
      {
        number: "03",
        title: "CONSTRUCTION EXECUTION",
        description:
          "Complete structural, civil, facade, and technical building works executed cleanly to engineering specifications and agreed timelines.",
        image: "/images/services/turnkey-construction-execution-4k.webp",
        imageAlt:
          "Precision matte navy cabinetry and waterfall oak island beneath warm under-lit timber shelving, matte black pendants, and built-in stainless range",
      },
      {
        number: "04",
        title: "INTERIOR EXECUTION",
        description:
          "Turnkey fit-out encompassing custom millwork, flooring, ceiling lighting, bespoke furniture installation, and refined surface detailing.",
        image: "/images/services/turnkey-interior-execution-4k.webp",
        imageAlt:
          "Custom forest-green paneled cabinetry with brushed brass hardware, marble countertop island, twin brass dome pendants, and sunlit garden window",
      },
      {
        number: "05",
        title: "PROJECT MANAGEMENT",
        description:
          "Single-point accountability overseeing schedules, cost control, contractor coordination, and regular progress reporting without client stress.",
        image: "/images/services/turnkey-project-management-4k.webp",
        imageAlt:
          "Symmetrical U-shaped sage and dark-walnut modular kitchen featuring illuminated glass upper vitrines, backlit veined marble backsplash, and sleek black stone counters",
      },
      {
        number: "06",
        title: "FINAL HANDOVER",
        description:
          "Thorough snag inspections, MEP commissioning, deep-clean detailing, and smooth key handover ready for immediate occupancy.",
        image: "/images/services/turnkey-handover-4k.webp",
        imageAlt:
          "Completed architectural foyer corridor featuring custom walnut doors, floating backlit credenza with botanical vase, framed monochrome artworks, warm ceiling coves, and polished marble floor",
      },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceCategory | undefined {
  return SERVICE_CATEGORIES.find((item) => item.slug === slug);
}

