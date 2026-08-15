export type Capability = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  specs: { label: string; value: string }[];
  applications: string[];
  faqs: { question: string; answer: string }[];
  keyword: string;
};

export const capabilities: Capability[] = [
  {
    slug: "precision-molds",
    name: "Precision Molds",
    shortDescription:
      "Tight-tolerance molds machined on 5-axis CNC with CMM inspection for demanding OEM projects.",
    description:
      "Precision injection molds built to aerospace-grade tolerance control. Our 5-axis CNC centers, in-house wire EDM and CMM verification deliver repeatable cavity accuracy down to +/-0.005 mm.",
    specs: [
      { label: "Mold size (max)", value: "2,500 x 1,800 x 1,200 mm" },
      { label: "Mold weight (max)", value: "25 tons" },
      { label: "Tolerance", value: "+/-0.005 mm" },
      { label: "Steel grades", value: "S136, 718H, NAK80, P20, H13, S7" },
      { label: "Mold life", value: "500k - 3M shots" },
    ],
    applications: ["Medical device components", "Connector housings", "Gear & precision parts"],
    faqs: [
      {
        question: "What tolerance can you hold on precision injection molds?",
        answer:
          "We hold cavity dimensional tolerances of +/-0.005 mm on critical features and validate every core and cavity with CMM before assembly.",
      },
      {
        question: "What steel grades do you recommend for high-volume precision molds?",
        answer:
          "For volumes above 1M shots we recommend hardened S136 or NAK80. For prototype to mid volume, 718H or P20 offers a better cost balance.",
      },
    ],
    keyword: "precision injection mold manufacturer",
  },
  {
    slug: "multi-cavity-molds",
    name: "Multi-Cavity Molds",
    shortDescription:
      "4 to 128 cavity molds with balanced hot runner systems for low per-part cost at high volumes.",
    description:
      "Multi-cavity tooling engineered with flow simulation, balanced hot runner layouts and unit-cavity construction so cavities can be replaced without pulling the full mold. Ideal for caps, closures and consumables.",
    specs: [
      { label: "Cavity count", value: "4 - 128" },
      { label: "Hot runner", value: "Husky / YUDO / Mold-Masters / In-house" },
      { label: "Gate type", value: "Valve, thermal, submarine" },
      { label: "Mold life", value: "1M - 5M shots" },
      { label: "Cycle optimization", value: "Flow analysis + conformal cooling" },
    ],
    applications: ["Bottle caps & closures", "Packaging consumables", "Disposable medical"],
    faqs: [
      {
        question: "What is the fastest cycle time you have achieved?",
        answer:
          "On a 64-cavity cap mold we run a 3.8 second cycle with conformal cooling, down 22% from the initial design.",
      },
      {
        question: "Do you build unit-cavity multi-cavity molds?",
        answer:
          "Yes. Unit-cavity construction lets you replace a single damaged cavity in hours without reworking the whole mold, protecting uptime in high-volume production.",
      },
    ],
    keyword: "multi-cavity injection mold maker",
  },
  {
    slug: "two-shot-molding",
    name: "Two-Shot Molding",
    shortDescription:
      "Multi-material and overmolding tooling for soft-touch, waterproof seals and color differentiation.",
    description:
      "Two-shot and overmolding molds produced on our double-injection machines with rotary plates. We design for material bond strength and gating between the first and second shot to eliminate delamination.",
    specs: [
      { label: "Machine", value: "120 - 700 ton double-injection" },
      { label: "Material pairs", value: "TPE/TPU over PP/ABS/PC, LSR, PA over TPE" },
      { label: "Bond strength", value: "T-peel validated per part" },
      { label: "Rotary / core-back", value: "Both supported" },
      { label: "Mold life", value: "500k - 2M shots" },
    ],
    applications: ["Soft-touch handles", "Waterproof phone seals", "Gripped tool housings"],
    faqs: [
      {
        question: "Which material combinations bond reliably in two-shot molding?",
        answer:
          "TPE over PP, ABS or PC bonds without primer when the pair is matched for polarity and processing temperature. We validate bond strength by T-peel test on the first samples.",
      },
      {
        question: "Do you mold LSR two-shot parts?",
        answer:
          "Yes, we support LSR/thermoplastic two-shot molding including cold-deck LSR systems for medical and sealing applications.",
      },
    ],
    keyword: "two-shot injection mold manufacturer",
  },
  {
    slug: "gas-assisted-molding",
    name: "Gas-Assisted Molding",
    shortDescription:
      "Structural ribbing and hollow sections with reduced sink marks, weight and warpage for large parts.",
    description:
      "Gas-assisted injection molding for large structural parts. We balance gas channels against nominal wall thickness to achieve void ratios of 25-45%, cutting material cost while improving rigidity.",
    specs: [
      { label: "Part size (max)", value: "1,500 mm" },
      { label: "Void ratio", value: "25 - 45%" },
      { label: "Gas type", value: "Nitrogen (high-pressure)" },
      { label: "Sink mark", value: "Eliminated on ribs & bosses" },
      { label: "Cycle benefit", value: "Up to 20% faster cooling" },
    ],
    applications: ["Automotive interior trim", "TV frames", "Large handles & housings"],
    faqs: [
      {
        question: "How much material can gas-assist save?",
        answer:
          "On typical ribbed housings gas-assist saves 20-35% of material versus solid cross-sections while improving stiffness and eliminating sink marks.",
      },
    ],
    keyword: "gas assisted injection molding mold supplier",
  },
  {
    slug: "stack-molds",
    name: "Stack Molds",
    shortDescription:
      "Double-face tooling that doubles output per clamp ton without new machinery investment.",
    description:
      "Stack molds for thin-wall packaging and high-volume parts that push output per ton of clamp force. Our stack tooling integrates synchronized hot runner gating for consistent fill across both parting lines.",
    specs: [
      { label: "Stack levels", value: "2 - 3 levels" },
      { label: "Output gain", value: "Up to 2x per cycle" },
      { label: "Clamp force", value: "650 - 1,500 tons" },
      { label: "Typical parts", value: "Thin-wall containers, lids" },
      { label: "Mold life", value: "2M - 5M shots" },
    ],
    applications: ["Thin-wall food containers", "Lids & closures", "High-volume disposables"],
    faqs: [
      {
        question: "When does a stack mold pay off versus a multi-cavity mold?",
        answer:
          "Stack molds double output on an existing press. If you are clamp-force limited and cycle-limited, stack tooling typically pays back within 8-14 months at high volumes.",
      },
    ],
    keyword: "stack mold manufacturer",
  },
];

export function getCapability(slug: string) {
  return capabilities.find((c) => c.slug === slug);
}
