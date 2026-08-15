export type CaseStudy = {
  slug: string;
  title: string;
  industry: string;
  challenge: string;
  solution: string;
  results: { label: string; value: string }[];
  moldSpecs: { label: string; value: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "automotive-dash-connector",
    title: "24-Cavity Connector Mold for a German Tier-1 Supplier",
    industry: "automotive",
    challenge:
      "A German Tier-1 needed a 24-cavity connector housing mold with +/-0.01 mm pitch accuracy across cavities, delivered in 6 weeks to hit a vehicle program SOP.",
    solution:
      "Unit-cavity construction with hardened S136 inserts, valve-gated hot runner and conformal cooling. Full PPAP Level 3 with CMM reports per cavity and gold-sample approval in 4.5 weeks.",
    results: [
      { label: "Lead time", value: "4.5 weeks vs 8-week industry average" },
      { label: "Cavity accuracy", value: "+/-0.008 mm achieved" },
      { label: "Tool life", value: "2M shots guaranteed" },
      { label: "First-pass OK", value: "98.6%" },
    ],
    moldSpecs: [
      { label: "Cavities", value: "24" },
      { label: "Steel", value: "S136 hardened" },
      { label: "Gating", value: "Valve-gated hot runner" },
      { label: "Mold size", value: "850 x 650 x 620 mm" },
    ],
  },
  {
    slug: "medical-luer-syringe",
    title: "Medical Luer Components at 3.2s Cycle",
    industry: "medical",
    challenge:
      "A medical OEM wanted luer lock components with zero flash, clean-room compatible molding and a 30% cycle reduction versus their current tooling.",
    solution:
      "High-precision 32-cavity tooling with self-centering locks, shut-off hardened inserts and a balanced manifold. Cycle development compressed wall thickness without losing pressure-retention performance.",
    results: [
      { label: "Cycle time", value: "3.2s (down 30%)" },
      { label: "Flash", value: "None, visual inspection passed" },
      { label: "Dimensions", value: "CPK > 1.67" },
      { label: "Material waste", value: "-18%" },
    ],
    moldSpecs: [
      { label: "Cavities", value: "32" },
      { label: "Steel", value: "S136 + H13 shut-offs" },
      { label: "Cycle", value: "3.2 seconds" },
      { label: "Clean room", value: "ISO 7 compatible" },
    ],
  },
  {
    slug: "two-shot-power-tool-grip",
    title: "Two-Shot Soft-Grip Housing for a Power Tool Brand",
    industry: "power-tools",
    challenge:
      "A power tool manufacturer needed a two-shot drill housing with a soft-TPE grip that would not delaminate after 100,000 cycles of impact testing.",
    solution:
      "Rotary-plate two-shot tooling with matched PP/TPE pair. T-peel bond validation and molded-in mechanical keying under the grip eliminated delamination risk.",
    results: [
      { label: "Impact test", value: "Passed 100k cycles" },
      { label: "Bond strength", value: "T-peel > 15 N/mm" },
      { label: "Aesthetic", value: "Zero witness lines" },
      { label: "Tool life", value: "1.5M shots" },
    ],
    moldSpecs: [
      { label: "Process", value: "Two-shot rotary" },
      { label: "Materials", value: "PP + TPE" },
      { label: "Cavities", value: "2 + 2" },
      { label: "Mold size", value: "1,050 x 900 x 780 mm" },
    ],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
