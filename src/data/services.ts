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
        image: "/images/services/architecture.webp",
        imageAlt:
          "Modern architectural building facade with travertine walls, timber soffits, and charcoal architectural louvers",
      },
      {
        number: "04",
        title: "SPACE PLANNING",
        description:
          "Human-centered interior zoning crafted for effortless daily movement, natural ventilation, acoustic calm, and balanced indoor-outdoor proportions.",
        image: "/images/services/interior-design.webp",
        imageAlt:
          "Serene open architectural interior balancing oak paneling, natural daylight, and generous spatial flow",
      },
      {
        number: "05",
        title: "3D ARCHITECTURAL VISUALISATION",
        description:
          "Photorealistic architectural imagery, twilight lighting studies, and spatial previews that let clients experience proportions and materials before construction begins.",
        image: "/images/services/arch-visualisation.webp",
        imageAlt:
          "Twilight 3D architectural visualization of a luxury villa glowing in warm interior light against a blue-hour sky",
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
        image: "/images/services/interior-design.webp",
        imageAlt:
          "Minimalist luxury residential living space with warm oak wall paneling and travertine table",
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
        image: "/images/services/arch-planning.webp",
        imageAlt:
          "Ordered architectural terraces and balanced indoor-outdoor circulation geometry",
      },
      {
        number: "04",
        title: "MATERIAL AND FURNITURE SELECTION",
        description:
          "Curated natural stones, warm timber finishes, bespoke cabinetry, and architectural furnishings unified into a calm, tactile palette.",
        image: "/images/services/arch-concept.webp",
        imageAlt:
          "Studio selection of pale wood, natural travertine stone, and matte charcoal finishes",
      },
      {
        number: "05",
        title: "LIGHTING AND AESTHETIC DESIGN",
        description:
          "Layered recessed, cove, and accent illumination paired with balanced tonal styling that brings warmth and architectural depth from day to evening.",
        image: "/images/services/arch-visualisation.webp",
        imageAlt:
          "Warm architectural recessed and cove lighting glowing across glazed interiors at dusk",
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
        image: "/images/services/arch-planning.webp",
        imageAlt:
          "Comprehensive residential site layout showing organized courtyard and structural sequencing",
      },
      {
        number: "02",
        title: "RESIDENTIAL AND COMMERCIAL CONSTRUCTION",
        description:
          "Full-scale civil and structural building delivery for bespoke villas, modern residences, and commercial developments built to lasting standards.",
        image: "/images/services/project-construction.webp",
        imageAlt:
          "Fair-faced concrete structural columns, steel beams, and timber ceiling beams in build phase",
      },
      {
        number: "03",
        title: "SITE EXECUTION",
        description:
          "Hands-on on-site engineering oversight managing excavation, structural concrete, masonry, glazing installation, and finishing trades with precision.",
        image: "/images/services/architecture.webp",
        imageAlt:
          "Executed residential exterior facade with travertine cladding, louvers, and glass railings",
      },
      {
        number: "04",
        title: "PROJECT COORDINATION",
        description:
          "Seamless alignment between architects, structural consultants, MEP contractors, and specialized craftsmen to avoid delays and rework.",
        image: "/images/services/arch-concept.webp",
        imageAlt:
          "Architectural structural massing and coordinated multidisciplinary planning study",
      },
      {
        number: "05",
        title: "CONSTRUCTION QUALITY MANAGEMENT",
        description:
          "Rigorous material testing, alignment tolerance checks, waterproofing audits, and stage-wise technical sign-offs guaranteeing durable craftsmanship.",
        image: "/images/services/turnkey-solutions.webp",
        imageAlt:
          "Precision-finished travertine paving, timber soffits, and seamless glazing alignment",
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
        image: "/images/services/arch-concept.webp",
        imageAlt:
          "Architectural massing model and material planning study in soft studio daylight",
      },
      {
        number: "02",
        title: "MATERIAL PROCUREMENT",
        description:
          "Direct sourcing, sample validation, vendor scheduling, and transparent supply-chain management for stones, timber, fixtures, and hardware.",
        image: "/images/services/architecture.webp",
        imageAlt:
          "Curated travertine stone, cedar timber soffits, and architectural steel louvers on site",
      },
      {
        number: "03",
        title: "CONSTRUCTION EXECUTION",
        description:
          "Complete structural, civil, facade, and technical building works executed cleanly to engineering specifications and agreed timelines.",
        image: "/images/services/project-construction.webp",
        imageAlt:
          "Modern architectural concrete columns, timber framing, and steel beams under construction",
      },
      {
        number: "04",
        title: "INTERIOR EXECUTION",
        description:
          "Turnkey fit-out encompassing custom millwork, flooring, ceiling lighting, bespoke furniture installation, and refined surface detailing.",
        image: "/images/services/interior-design.webp",
        imageAlt:
          "Finished minimalist interior featuring custom oak wall paneling and travertine stone table",
      },
      {
        number: "05",
        title: "PROJECT MANAGEMENT",
        description:
          "Single-point accountability overseeing schedules, cost control, contractor coordination, and regular progress reporting without client stress.",
        image: "/images/services/arch-planning.webp",
        imageAlt:
          "Coordinated multi-zone residential architecture and landscape execution",
      },
      {
        number: "06",
        title: "FINAL HANDOVER",
        description:
          "Thorough snag inspections, MEP commissioning, deep-clean detailing, and smooth key handover ready for immediate occupancy.",
        image: "/images/services/turnkey-solutions.webp",
        imageAlt:
          "Completed modern luxury residence and courtyard lit warmly at golden hour ready for handover",
      },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceCategory | undefined {
  return SERVICE_CATEGORIES.find((item) => item.slug === slug);
}

