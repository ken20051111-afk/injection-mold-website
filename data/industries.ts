export type Industry = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  typicalParts: string[];
  standards: string[];
  materials: string[];
  keyword: string;
};

export const industries: Industry[] = [
  {
    slug: "automotive",
    name: "Automotive",
    shortDescription:
      "IATF 16949 certified molds for interior, exterior and under-hood plastic components.",
    description:
      "Automotive tooling built under IATF 16949 with PPAP documentation, IMDS submissions and APQP project management. We tool bumpers, interior trim, bezels, connectors and under-hood parts with full traceability.",
    typicalParts: ["Dashboard components", "Door panels", "Bumper covers", "Connector housings", "Under-hood parts"],
    standards: ["IATF 16949", "PPAP Level 3", "IMDS", "VDA 6.3"],
    materials: ["PP+EPDM", "ABS/ASA", "PC/ABS", "PA6-GF30", "POM"],
    keyword: "automotive plastic injection mold supplier",
  },
  {
    slug: "medical",
    name: "Medical & Healthcare",
    shortDescription:
      "Clean-room compatible tooling for disposables, diagnostics and drug-delivery devices.",
    description:
      "Medical molds validated for repeatable dimensional control, moldable in clean-room environments. We support ISO 13485 quality expectations, biocompatible material handling and full validation documentation.",
    typicalParts: ["Syringe components", "IV luer fittings", "Diagnostic cassettes", "Inhaler bodies", "Surgical instruments"],
    standards: ["ISO 13485 aligned", "21 CFR compliant materials", "Mold qualification reports"],
    materials: ["PC", "PP", "ABS", "POM", "PEEK", "PPSU"],
    keyword: "medical plastic injection mold manufacturer",
  },
  {
    slug: "electronics",
    name: "Consumer Electronics",
    shortDescription:
      "High-precision, high-cavity tooling for connectors, housings and wearable components.",
    description:
      "Precision electronics molds with tight tolerance gating, thin-wall capability down to 0.4 mm and controlled warp for cosmetic surfaces. We produce for smartphones, wearables, IoT and home appliances.",
    typicalParts: ["Connector bodies", "Device housings", "Wearable frames", "Lens holders", "Button assemblies"],
    standards: ["UL94 V-0 flammability", "RoHS / REACH compliant materials"],
    materials: ["PC", "PC/ABS", "PA9T", "LCP", "PBT"],
    keyword: "electronics injection mold maker",
  },
  {
    slug: "packaging",
    name: "Packaging",
    shortDescription:
      "High-speed, multi-cavity molds for caps, closures and thin-wall containers.",
    description:
      "Packaging tooling optimized for cycle time on high-cavity systems. Multi-cavity cap molds, thin-wall container molds and tamper-evident closure tooling with balanced hot runner manifolds.",
    typicalParts: ["Bottle caps", "Tamper-evident closures", "Thin-wall cups", "Food containers", "Pumps & dispensers"],
    standards: ["FDA food contact materials", "High-cavity balancing reports"],
    materials: ["PP", "HDPE", "PET", "PC"],
    keyword: "plastic packaging mold manufacturer",
  },
  {
    slug: "power-tools",
    name: "Power Tools & Outdoor",
    shortDescription:
      "Durable tooling for tool housings, gears and outdoor equipment built for impact and UV exposure.",
    description:
      "Power tool housings, gear trains and outdoor equipment molds engineered for impact strength and long tool life. Two-shot soft-grip and rubber overmolding supported in-house.",
    typicalParts: ["Drill housings", "Gear housings", "Soft-grip handles", "Lawn equipment parts", "Battery housings"],
    standards: ["UL 60745 aligned", "IPX waterproofing features"],
    materials: ["ABS", "PA6-GF30", "POM", "PP", "TPE"],
    keyword: "power tool plastic mold supplier",
  },
];

export function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug);
}
