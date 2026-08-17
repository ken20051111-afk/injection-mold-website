export const site = {
  brand: "勇鑫塑胶制品厂",
  legalName: "中国广东省东莞市勇鑫塑胶制品厂",
  tagline: "精密注塑模具制造商",
  domain: "https://moldcraftprecision.com",
  defaultLocale: "zh-CN",
  locales: ["zh-CN"],
  address: "中国广东省东莞市长安镇东莞大道 88 号 523850",
  phone: "+86 13316836188",
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
  { value: site.founded, suffix: "", label: "成立年份" },
  { value: site.annualMolds, suffix: "+", label: "年产模具（套）" },
  { value: site.machines, suffix: "", label: "CNC 与放电加工设备" },
  { value: site.exportsCountries, suffix: "+", label: "出口国家/地区" },
] as const;
