import { db } from "@/lib/db";
import type { Goal } from "@/lib/calories";

export type Recipe = {
  id: number;
  title: string;
  image: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  readyInMinutes: number | null;
  sourceUrl: string | null;
};

type SpoonacularItem = {
  id: number;
  title: string;
  image?: string | null;
  readyInMinutes?: number;
  sourceUrl?: string;
  nutrition?: {
    nutrients?: { name: string; amount: number }[];
  };
};

const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24h

function findNutrient(item: SpoonacularItem, name: string): number {
  const match = item.nutrition?.nutrients?.find(
    (n) => n.name.toLowerCase() === name.toLowerCase(),
  );
  return Math.round(match?.amount ?? 0);
}

function mapItem(item: SpoonacularItem): Recipe {
  return {
    id: item.id,
    title: item.title,
    image: item.image ?? null,
    calories: findNutrient(item, "Calories"),
    protein: findNutrient(item, "Protein"),
    carbs: findNutrient(item, "Carbohydrates"),
    fat: findNutrient(item, "Fat"),
    readyInMinutes: item.readyInMinutes ?? null,
    sourceUrl: item.sourceUrl ?? null,
  };
}

function goalQuery(goal: Goal): { minProtein?: number; type?: string; sort?: string } {
  switch (goal) {
    case "bulk":
      return { minProtein: 25, sort: "protein" };
    case "cut":
      return { minProtein: 20, type: "main course", sort: "protein" };
    case "maintain":
    default:
      return { sort: "popularity" };
  }
}

export async function suggestRecipes(opts: {
  goal: Goal;
  remainingCalories: number;
  max?: number;
}): Promise<{ recipes: Recipe[]; source: "spoonacular" | "cache" | "fallback" }> {
  const { goal, remainingCalories, max = 6 } = opts;

  const targetPerMeal = Math.max(200, Math.min(1200, Math.round(remainingCalories / 2)));
  const minCalories = Math.max(100, targetPerMeal - 200);
  const maxCalories = targetPerMeal + 200;

  const key = `v1:${goal}:${minCalories}-${maxCalories}`;

  const cached = await db.cachedRecipe.findUnique({ where: { queryKey: key } });
  if (cached && Date.now() - cached.fetchedAt.getTime() < CACHE_TTL_MS) {
    return { recipes: JSON.parse(cached.payload) as Recipe[], source: "cache" };
  }

  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    return { recipes: fallbackRecipes(goal, targetPerMeal).slice(0, max), source: "fallback" };
  }

  const params = new URLSearchParams({
    apiKey,
    number: String(max),
    minCalories: String(minCalories),
    maxCalories: String(maxCalories),
    addRecipeNutrition: "true",
    instructionsRequired: "true",
  });
  for (const [k, v] of Object.entries(goalQuery(goal))) {
    if (v !== undefined) params.set(k, String(v));
  }

  const url = `https://api.spoonacular.com/recipes/complexSearch?${params.toString()}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Spoonacular ${res.status}`);
    const data = (await res.json()) as { results?: SpoonacularItem[] };
    const recipes = (data.results ?? []).map(mapItem);

    await db.cachedRecipe.upsert({
      where: { queryKey: key },
      create: { queryKey: key, payload: JSON.stringify(recipes) },
      update: { payload: JSON.stringify(recipes), fetchedAt: new Date() },
    });

    return { recipes, source: "spoonacular" };
  } catch (err) {
    console.error("Spoonacular fetch failed:", err);
    if (cached) {
      return { recipes: JSON.parse(cached.payload) as Recipe[], source: "cache" };
    }
    return { recipes: fallbackRecipes(goal, targetPerMeal).slice(0, max), source: "fallback" };
  }
}

function fallbackRecipes(goal: Goal, targetPerMeal: number): Recipe[] {
  const base: Omit<Recipe, "calories">[] = [
    {
      id: 1,
      title: "Grilled chicken + rice bowl",
      image: null,
      protein: 45,
      carbs: 65,
      fat: 10,
      readyInMinutes: 25,
      sourceUrl: null,
    },
    {
      id: 2,
      title: "Greek yogurt + berries + honey",
      image: null,
      protein: 20,
      carbs: 35,
      fat: 5,
      readyInMinutes: 5,
      sourceUrl: null,
    },
    {
      id: 3,
      title: "Tuna avocado wrap",
      image: null,
      protein: 30,
      carbs: 40,
      fat: 18,
      readyInMinutes: 10,
      sourceUrl: null,
    },
    {
      id: 4,
      title: "Lentil + veggie stew",
      image: null,
      protein: 22,
      carbs: 55,
      fat: 8,
      readyInMinutes: 40,
      sourceUrl: null,
    },
    {
      id: 5,
      title: "Salmon + quinoa + broccoli",
      image: null,
      protein: 40,
      carbs: 45,
      fat: 22,
      readyInMinutes: 30,
      sourceUrl: null,
    },
    {
      id: 6,
      title: "Protein oatmeal + banana",
      image: null,
      protein: 30,
      carbs: 60,
      fat: 8,
      readyInMinutes: 10,
      sourceUrl: null,
    },
  ];
  const cap = goal === "bulk" ? targetPerMeal + 150 : goal === "cut" ? targetPerMeal - 100 : targetPerMeal;
  return base.map((r) => ({ ...r, calories: Math.max(180, cap) }));
}
