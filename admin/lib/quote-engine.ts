export type QuoteInput = {
  partDimensionsMm?: { length: number; width: number; height: number };
  cavityCount?: number;
  material?: string;
  steelGrade?: string;
  moldLifeTarget?: string;
  tolerance?: string;
  surfaceFinish?: string;
  annualVolume?: number;
  hotRunner?: boolean;
  undercuts?: number;
  drawingsComplete?: boolean;
};

export type QuoteEstimate = {
  baseMoldCost: number;
  cavityMultiplier: number;
  complexityMultiplier: number;
  steelMultiplier: number;
  estimatedCost: number;
  estimateLow: number;
  estimateHigh: number;
  leadTimeDays: number;
  confidence: "rough" | "good";
};

const BASE_CAVITY_COST = 65000;

const CAVITY_FACTOR: Record<number, number> = {
  1: 1,
  2: 1.6,
  4: 2.7,
  8: 4.2,
  16: 6.5,
  32: 10,
  64: 15,
  128: 24,
};

const STEEL_FACTOR: Record<string, number> = {
  P20: 1,
  "718H": 1.15,
  NAK80: 1.35,
  S136: 1.5,
  H13: 1.6,
  S7: 1.45,
};

const MATERIAL_FACTOR: Record<string, number> = {
  ABS: 1,
  PP: 0.95,
  PC: 1.15,
  "PC/ABS": 1.1,
  PA: 1.2,
  POM: 1.15,
  TPU: 1.25,
  PEEK: 1.6,
  PPSU: 1.5,
  LSR: 1.5,
};

export function estimateQuote(input: QuoteInput): QuoteEstimate {
  const area =
    input.partDimensionsMm && input.partDimensionsMm.length > 0
      ? Math.max(input.partDimensionsMm.length, 100) *
        Math.max(input.partDimensionsMm.width, 100)
      : 30000;

  const baseMoldCost = BASE_CAVITY_COST * Math.max(1, area / 30000);

  const cavityCount = input.cavityCount ?? 1;
  let cavityKey = 1;
  const keys = Object.keys(CAVITY_FACTOR)
    .map(Number)
    .sort((a, b) => a - b);
  for (const k of keys) {
    if (cavityCount >= k) cavityKey = k;
  }
  const cavityMultiplier = CAVITY_FACTOR[cavityKey];

  let complexity = 1;
  if (input.undercuts && input.undercuts > 0) {
    complexity += input.undercuts * 0.06;
  }
  if (input.tolerance && /0\.0\d+/.test(input.tolerance)) {
    complexity += 0.2;
  }
  if (input.surfaceFinish && input.surfaceFinish.toUpperCase().startsWith("A")) {
    complexity += 0.15;
  }
  if (input.hotRunner && cavityCount > 1) {
    complexity += 0.15;
  }

  const steelMultiplier = STEEL_FACTOR[input.steelGrade ?? "P20"] ?? 1;

  const materialMultiplier = MATERIAL_FACTOR[input.material ?? "ABS"] ?? 1;

  const estimatedCost =
    baseMoldCost *
    cavityMultiplier *
    complexity *
    steelMultiplier *
    materialMultiplier;

  const moldLifeBoost = input.moldLifeTarget && input.moldLifeTarget.includes("M") ? 1.08 : 1;
  const annualBoost = input.annualVolume && input.annualVolume >= 500000 ? 1.1 : 1;

  const final = estimatedCost * moldLifeBoost * annualBoost;
  const confidence = input.drawingsComplete && input.partDimensionsMm ? "good" : "rough";
  const spread = confidence === "good" ? 0.15 : 0.3;

  const leadTimeDays = Math.round(14 + cavityKey * 1.2 + complexity * 8);

  return {
    baseMoldCost: Math.round(baseMoldCost),
    cavityMultiplier,
    complexityMultiplier: Number(complexity.toFixed(2)),
    steelMultiplier,
    estimatedCost: Math.round(final / 100) * 100,
    estimateLow: Math.round((final * (1 - spread)) / 100) * 100,
    estimateHigh: Math.round((final * (1 + spread)) / 100) * 100,
    leadTimeDays,
    confidence,
  };
}

export function formatCny(n: number): string {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0,
  }).format(n);
}
