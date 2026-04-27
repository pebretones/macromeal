export const ACTIVITY_LEVELS = {
  sedentary: { label: "Sedentary (little or no exercise)", multiplier: 1.2 },
  light: { label: "Lightly active (1-3 days/week)", multiplier: 1.375 },
  moderate: { label: "Moderately active (3-5 days/week)", multiplier: 1.55 },
  active: { label: "Very active (6-7 days/week)", multiplier: 1.725 },
  very_active: { label: "Athlete (2x/day training)", multiplier: 1.9 },
} as const;

export type ActivityLevel = keyof typeof ACTIVITY_LEVELS;

export const GOALS = {
  cut: { label: "Cut (lose fat)", adjustment: -500 },
  maintain: { label: "Maintain", adjustment: 0 },
  bulk: { label: "Bulk (gain muscle)", adjustment: 300 },
} as const;

export type Goal = keyof typeof GOALS;

export type Sex = "male" | "female";

export function mifflinStJeor(params: {
  sex: Sex;
  weightKg: number;
  heightCm: number;
  ageYears: number;
}): number {
  const base = 10 * params.weightKg + 6.25 * params.heightCm - 5 * params.ageYears;
  return params.sex === "male" ? base + 5 : base - 161;
}

export function computeDailyCalorieTarget(params: {
  sex: Sex;
  weightKg: number;
  heightCm: number;
  ageYears: number;
  activityLevel: ActivityLevel;
  goal: Goal;
}): number {
  const bmr = mifflinStJeor(params);
  const tdee = bmr * ACTIVITY_LEVELS[params.activityLevel].multiplier;
  return Math.round(tdee + GOALS[params.goal].adjustment);
}
