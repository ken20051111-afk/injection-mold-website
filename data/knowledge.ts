export type KnowledgeEntry = {
  category: string;
  title: string;
  content: string;
  sourceUrl?: string;
};

export const knowledgeBase: KnowledgeEntry[] = [
  {
    category: "company",
    title: "Company overview",
    content:
      "MoldCraft Precision Mold Co., Ltd. is an injection mold manufacturer in Chang'an, Dongguan, China, founded in 2006. We build 1,200+ molds per year for automotive, medical, electronics, packaging and power tool customers across 30+ countries, mainly the US, Germany, UK and France. We employ 86 engineers and run 42 CNC and EDM machines.",
  },
  {
    category: "company",
    title: "Certifications",
    content:
      "MoldCraft is certified to ISO 9001:2015, IATF 16949 and ISO 14001. Automotive programs follow PPAP Level 3 and IMDS. Medical tooling is produced to ISO 13485-aligned documentation standards with biocompatible material handling.",
  },
  {
    category: "company",
    title: "Delivery performance",
    content:
      "Our standard mold lead time is 3-6 weeks depending on size and cavity count. Prototype molds can ship in 3-4 weeks. Our on-time delivery rate is 98%. We guarantee mold life for the agreed shot count.",
  },
  {
    category: "capability",
    title: "Precision mold capability",
    content:
      "We hold cavity tolerances of +/-0.005 mm on critical features. Maximum mold size is 2,500 x 1,800 x 1,200 mm and maximum mold weight is 25 tons. CMM inspection is performed on every cavity before delivery.",
  },
  {
    category: "capability",
    title: "Multi-cavity molds",
    content:
      "We build 4 to 128 cavity molds with balanced hot runner systems from Husky, YUDO or Mold-Masters. Unit-cavity construction allows replacing a single cavity without pulling the mold. Typical cycle on a 64-cavity cap mold is 3.8 seconds.",
  },
  {
    category: "capability",
    title: "Two-shot and overmolding",
    content:
      "Two-shot and overmolding tooling is produced on 120-700 ton double-injection machines with rotary plates. We support TPE/TPU over PP, ABS and PC, plus LSR overmolding. Bond strength is validated by T-peel test.",
  },
  {
    category: "capability",
    title: "Gas-assisted molding",
    content:
      "Gas-assisted injection molding for parts up to 1,500 mm with void ratios of 25-45%. Saves 20-35% material on ribbed housings and eliminates sink marks.",
  },
  {
    category: "capability",
    title: "Stack molds",
    content:
      "Two and three level stack molds for thin-wall packaging that double output per cycle. Typical applications are thin-wall containers, lids and closures.",
  },
  {
    category: "process",
    title: "Mold steel selection",
    content:
      "Recommended steel by volume: P20 for up to 250k shots, 718H for up to 1M shots, NAK80 for high-polish cosmetic molds, S136 hardened for corrosive resins and up to 3M shots, H13 for hot surfaces.",
  },
  {
    category: "process",
    title: "Surface finish standards",
    content:
      "We produce SPI A1 to D3 finishes plus VDI textures. SPI A1 achieves 0.012-0.025 um Ra for optical surfaces. Cosmetic automotive interior parts typically run SPI B1.",
  },
  {
    category: "process",
    title: "Materials processed",
    content:
      "Common materials include ABS, PC, PC/ABS, PP, PA6/PA66 (GF reinforced), POM, PBT, PET, PMMA, TPU, TPE, PEEK and PPSU. We also process LSR for medical sealing applications.",
  },
  {
    category: "process",
    title: "Mold sampling and trials",
    content:
      "We run trial samples on production-identical machines (80-1,500 tons). DOE sampling, dimensional reports and gold-sample approval are standard before mold shipping.",
  },
  {
    category: "quote",
    title: "How to request a quote",
    content:
      "To get an accurate quote, send the 3D model (STEP/STP preferred), 2D drawing with tolerances, target annual volume, resin material, target mold life, and your destination country. Lead time target and annual volume are the two factors that most affect price.",
  },
  {
    category: "quote",
    title: "Mold price ranges",
    content:
      "For a mid-size part (about 200x150x100 mm): 1 cavity $8,000-$15,000, 4 cavities $15,000-$30,000, 8 cavities with hot runner $30,000-$60,000. Prototype molds start around $3,000. Exact pricing requires a drawing.",
  },
  {
    category: "quote",
    title: "Payment terms",
    content:
      "Standard payment terms are 50% deposit with the PO and 50% before shipment. T/T in USD is accepted. For first-time customers we offer milestone payments: 40% with PO, 40% at trial approval, 20% before shipment.",
  },
  {
    category: "quote",
    title: "Shipping and logistics",
    content:
      "Molds ship by sea freight (FOB Shenzhen) or air freight. We export to the US, Germany, UK, France and 26 other countries. Molds are exported with proper export packing and, where required, testing certificates.",
  },
  {
    category: "support",
    title: "Post-delivery support",
    content:
      "We provide a 12-month warranty on molds against manufacturing defects, free design reviews during tooling, and lifetime technical support. Spare inserts and maintenance guidance are available on request.",
  },
  {
    category: "support",
    title: "Can we run production for you too",
    content:
      "Yes. Beyond mold building we offer contract injection molding with 22 machines from 80 to 1,500 tons, so you can order mold plus production in one place.",
  },
];
