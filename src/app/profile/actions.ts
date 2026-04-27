"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { ACTIVITY_LEVELS, GOALS, computeDailyCalorieTarget } from "@/lib/calories";

const profileSchema = z.object({
  sex: z.enum(["male", "female"]),
  ageYears: z.coerce.number().int().min(10).max(100),
  heightCm: z.coerce.number().min(100).max(250),
  weightKg: z.coerce.number().min(30).max(300),
  activityLevel: z.enum(
    Object.keys(ACTIVITY_LEVELS) as [keyof typeof ACTIVITY_LEVELS, ...Array<keyof typeof ACTIVITY_LEVELS>],
  ),
  goal: z.enum(Object.keys(GOALS) as [keyof typeof GOALS, ...Array<keyof typeof GOALS>]),
});

export type ProfileActionState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function saveProfileAction(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const user = await requireUser();

  const parsed = profileSchema.safeParse({
    sex: formData.get("sex"),
    ageYears: formData.get("ageYears"),
    heightCm: formData.get("heightCm"),
    weightKg: formData.get("weightKg"),
    activityLevel: formData.get("activityLevel"),
    goal: formData.get("goal"),
  });

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const dailyCalorieTarget = computeDailyCalorieTarget(parsed.data);

  await db.profile.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...parsed.data, dailyCalorieTarget },
    update: { ...parsed.data, dailyCalorieTarget },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
