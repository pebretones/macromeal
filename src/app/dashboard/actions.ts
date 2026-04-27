"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";

const foodSchema = z.object({
  name: z.string().min(1).max(200),
  calories: z.coerce.number().int().min(0).max(10000),
  proteinG: z.coerce.number().min(0).max(1000).optional(),
  carbsG: z.coerce.number().min(0).max(1000).optional(),
  fatG: z.coerce.number().min(0).max(1000).optional(),
});

export type FoodActionState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  ok?: boolean;
};

export async function addFoodAction(
  _prev: FoodActionState,
  formData: FormData,
): Promise<FoodActionState> {
  const user = await requireUser();

  const parsed = foodSchema.safeParse({
    name: formData.get("name"),
    calories: formData.get("calories"),
    proteinG: formData.get("proteinG") || undefined,
    carbsG: formData.get("carbsG") || undefined,
    fatG: formData.get("fatG") || undefined,
  });

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  await db.foodEntry.create({
    data: { userId: user.id, ...parsed.data },
  });

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteFoodAction(formData: FormData) {
  const user = await requireUser();
  const id = formData.get("id");
  if (typeof id !== "string") return;

  await db.foodEntry.deleteMany({
    where: { id, userId: user.id },
  });

  revalidatePath("/dashboard");
}
