export type Material = {
  name: string;
  shortName: string;
  properties: string[];
  applications: string[];
  costIndex: string;
  shrink: string;
};

export const materials: Material[] = [
  {
    name: "Acrylonitrile Butadiene Styrene",
    shortName: "ABS",
    properties: ["Good impact strength", "Easily machined & painted", "Low cost"],
    applications: ["Housings", "Automotive interior", "Consumer goods"],
    costIndex: "$",
    shrink: "0.4-0.7%",
  },
  {
    name: "Polycarbonate",
    shortName: "PC",
    properties: ["Very high impact", "Optical clarity", "High heat resistance"],
    applications: ["Lens & light covers", "Safety equipment", "Medical devices"],
    costIndex: "$$",
    shrink: "0.5-0.7%",
  },
  {
    name: "Polycarbonate / ABS Blend",
    shortName: "PC/ABS",
    properties: ["Balanced strength & cost", "Good UV stability", "Wide processing window"],
    applications: ["Electronics housings", "Automotive trim", "Power tool bodies"],
    costIndex: "$$",
    shrink: "0.5-0.7%",
  },
  {
    name: "Polyamide (Nylon) 6 / 66",
    shortName: "PA6 / PA66",
    properties: ["Excellent toughness", "Chemical & wear resistance", "GF reinforced grades"],
    applications: ["Gears", "Clips & fasteners", "Under-hood parts"],
    costIndex: "$$",
    shrink: "0.7-1.8%",
  },
  {
    name: "Polypropylene",
    shortName: "PP",
    properties: ["Lightweight", "Chemical resistant", "Very low cost"],
    applications: ["Packaging", "Automotive interior", "Houseware"],
    costIndex: "$",
    shrink: "1.0-2.5%",
  },
  {
    name: "Polyoxymethylene (Acetal)",
    shortName: "POM",
    properties: ["Low friction", "High dimensional stability", "Excellent wear"],
    applications: ["Gears", "Precision bearings", "Sprockets"],
    costIndex: "$$",
    shrink: "1.5-2.2%",
  },
  {
    name: "Thermoplastic Polyurethane",
    shortName: "TPU",
    properties: ["Elastomeric flexibility", "Excellent abrasion resistance", "Overmoldable"],
    applications: ["Soft-touch grips", "Protective covers", "Seals"],
    costIndex: "$$$",
    shrink: "0.6-1.5%",
  },
  {
    name: "Polyether Ether Ketone",
    shortName: "PEEK",
    properties: ["Ultra-high temperature", "Chemical & wear resistant", "Premium cost"],
    applications: ["Aerospace", "Medical implantable", "Sealing rings"],
    costIndex: "$$$$",
    shrink: "0.5-1.0%",
  },
  {
    name: "Polymethyl Methacrylate",
    shortName: "PMMA",
    properties: ["Excellent clarity", "UV stable", "Scratch resistant"],
    applications: ["Lenses", "Light guides", "Signage"],
    costIndex: "$$",
    shrink: "0.3-0.6%",
  },
  {
    name: "Polybutylene Terephthalate",
    shortName: "PBT",
    properties: ["High heat & electrical", "Dimensional stability", "Low creep"],
    applications: ["Connectors", "Coil bobbins", "Automotive electronics"],
    costIndex: "$$",
    shrink: "0.8-2.0%",
  },
];

export const tolerances = [
  { feature: "Critical dimensions", standard: "+/-0.01 mm", precision: "+/-0.005 mm" },
  { feature: "Standard dimensions", standard: "+/-0.05 mm", precision: "+/-0.02 mm" },
  { feature: "Wall thickness", standard: "+/-0.03 mm", precision: "+/-0.01 mm" },
  { feature: "Hole positions", standard: "+/-0.05 mm", precision: "+/-0.015 mm" },
] as const;

export const surfaceFinishes = [
  { grade: "SPI A1", finish: "SPI-A1", roughness: "0.012-0.025 um Ra", use: "Cosmetic surfaces, optical" },
  { grade: "SPI A3", finish: "SPI-A3", roughness: "0.05-0.10 um Ra", use: "Polished cosmetic parts" },
  { grade: "SPI B1", finish: "SPI-B1", roughness: "0.10-0.15 um Ra", use: "Automotive interior" },
  { grade: "SPI C1", finish: "SPI-C1", roughness: "0.35-0.45 um Ra", use: "Functional surfaces" },
  { grade: "SPI D1", finish: "SPI-D1", roughness: "1.2-1.7 um Ra", use: "Textured, low gloss" },
  { grade: "VDI 27", finish: "VDI-27", roughness: "0.9-1.1 um Ra", use: "Molded-in texture" },
] as const;

export const steelGrades = [
  { grade: "P20", hardness: "28-32 HRC", use: "Prototype & low volume", life: "Up to 250k shots" },
  { grade: "718H", hardness: "33-38 HRC", use: "Mid volume, pre-hardened", life: "Up to 1M shots" },
  { grade: "NAK80", hardness: "38-42 HRC", use: "High polish, mirrors", life: "Up to 1.5M shots" },
  { grade: "S136", hardness: "48-52 HRC", use: "Corrosive resins, long life", life: "1M - 3M shots" },
  { grade: "H13", hardness: "46-52 HRC", use: "Hot surfaces, high temp resins", life: "Up to 2M shots" },
  { grade: "S7", hardness: "46-50 HRC", use: "High impact tooling", life: "Up to 2M shots" },
] as const;
