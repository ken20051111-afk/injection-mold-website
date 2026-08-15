export const site = {
  brand: "MoldCraft Precision",
  legalName: "MoldCraft Precision Mold Co., Ltd.",
  tagline: "Precision Injection Mold Manufacturer",
  domain: "https://moldcraftprecision.com",
  defaultLocale: "en",
  locales: ["en", "de", "es", "fr"],
  address: "88 Dongguan Avenue, Chang'an, Dongguan, Guangdong 523850, China",
  phone: "+86 769 8888 6688",
  email: "sales@moldcraftprecision.com",
  salesTeamEmails: ["sales@moldcraftprecision.com", "kevin@moldcraftprecision.com"],
  founded: 2006,
  machines: 42,
  engineers: 86,
  annualMolds: 1200,
  exportsCountries: 30,
  certifications: ["ISO 9001:2015", "IATF 16949", "ISO 14001"],
  leadTimeWeeks: 3,
  deliveryRate: 98,
} as const;

export const companyFacts = [
  { value: site.founded, suffix: "", label: "Founded" },
  { value: site.annualMolds, suffix: "+", label: "Molds Built / Year" },
  { value: site.machines, suffix: "", label: "CNC & EDM Machines" },
  { value: site.exportsCountries, suffix: "+", label: "Export Countries" },
] as const;
