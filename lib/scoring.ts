const HIGH_VALUE_COUNTRIES = ["us", "de", "gb", "fr", "ch", "nl", "se", "dk", "no", "at", "be", "ie", "it", "es", "ca", "au"];
const MID_VALUE_COUNTRIES = ["jp", "kr", "tw", "sg", "pl", "cz", "fi"];

export type ScoreInput = {
  country?: string;
  industry?: string;
  materials?: string[];
  cavityTarget?: number;
  annualVolume?: number;
  drawingsAvailable?: boolean;
  targetPrice?: number;
  deadline?: string;
  messageLength?: number;
  emailProvided?: boolean;
  phoneProvided?: boolean;
  intentTags?: string[];
};

export type ScoreBreakdown = {
  score: number;
  fitScore: number;
  intentScore: number;
  engagementScore: number;
  timingScore: number;
  notes: string[];
};

export function scoreLead(input: ScoreInput): ScoreBreakdown {
  const notes: string[] = [];
  let fit = 0;
  let intent = 0;
  let engagement = 0;
  let timing = 0;

  const country = (input.country ?? "").toLowerCase();
  if (HIGH_VALUE_COUNTRIES.includes(country)) {
    fit += 20;
    notes.push("High-value export market");
  } else if (MID_VALUE_COUNTRIES.includes(country)) {
    fit += 12;
  } else {
    fit += 5;
  }

  const highValueIndustries = ["automotive", "medical", "electronics"];
  if (input.industry && highValueIndustries.includes(input.industry.toLowerCase())) {
    fit += 10;
    notes.push("High-margin industry");
  }

  if (input.drawingsAvailable) {
    intent += 20;
    notes.push("Drawings available");
  }
  if (input.materials && input.materials.length > 0) {
    intent += 10;
  }
  if (input.cavityTarget && input.cavityTarget >= 4) {
    intent += 5;
    notes.push("Multi-cavity requirement");
  }
  if (input.annualVolume && input.annualVolume >= 100000) {
    intent += 10;
    notes.push("High annual volume");
  }
  if (input.targetPrice && input.targetPrice >= 5000) {
    intent += 5;
  }
  if (input.messageLength && input.messageLength > 200) {
    intent += 5;
  }

  if (input.emailProvided) engagement += 10;
  if (input.phoneProvided) engagement += 10;
  if (input.intentTags?.includes("quote_request")) engagement += 10;
  if (input.intentTags?.includes("specific_requirements")) engagement += 5;

  if (input.deadline) {
    const days = Math.ceil(
      (new Date(input.deadline).getTime() - Date.now()) / 86400000,
    );
    if (days <= 60) {
      timing += 10;
      notes.push("Urgent program");
    } else if (days <= 120) {
      timing += 6;
    }
  }

  const score = Math.min(100, fit + intent + engagement + timing);
  return { score, fitScore: fit, intentScore: intent, engagementScore: engagement, timingScore: timing, notes };
}

export function priorityFromScore(score: number): number {
  if (score >= 70) return 3;
  if (score >= 50) return 2;
  if (score >= 30) return 1;
  return 0;
}

export function actionFromScore(score: number): "urgent" | "follow_up" | "nurture" {
  if (score >= 60) return "urgent";
  if (score >= 40) return "follow_up";
  return "nurture";
}
