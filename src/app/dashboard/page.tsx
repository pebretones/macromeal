import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { GOALS, type Goal } from "@/lib/calories";
import { suggestRecipes } from "@/lib/recipes";
import { FoodForm } from "./food-form";
import { deleteFoodAction } from "./actions";

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

const goalBadgeClass: Record<Goal, string> = {
  cut: "goal-cut",
  maintain: "goal-maintain",
  bulk: "goal-bulk",
};

export default async function DashboardPage() {
  const user = await requireUser();
  const profile = await db.profile.findUnique({ where: { userId: user.id } });

  if (!profile) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20">
        <div className="card p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-3xl dark:bg-emerald-950/50">
            👋
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">One more step</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Tell us a bit about you so we can compute your daily calorie target.
          </p>
          <Link
            href="/profile"
            className="mt-6 inline-block rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 px-6 py-2.5 font-medium text-white shadow-lg shadow-emerald-500/25 transition-transform hover:scale-[1.02]"
          >
            Set up profile
          </Link>
        </div>
      </div>
    );
  }

  const entries = await db.foodEntry.findMany({
    where: { userId: user.id, loggedAt: { gte: startOfToday() } },
    orderBy: { loggedAt: "desc" },
  });

  const consumed = entries.reduce((s, e) => s + e.calories, 0);
  const target = profile.dailyCalorieTarget;
  const remaining = target - consumed;
  const percent = Math.min(100, Math.round((consumed / target) * 100));

  const totalProtein = Math.round(entries.reduce((s, e) => s + (e.proteinG ?? 0), 0));
  const totalCarbs = Math.round(entries.reduce((s, e) => s + (e.carbsG ?? 0), 0));
  const totalFat = Math.round(entries.reduce((s, e) => s + (e.fatG ?? 0), 0));

  // Macro targets based on calorie target (roughly 30P / 40C / 30F)
  const proteinTarget = Math.round((target * 0.3) / 4);
  const carbsTarget = Math.round((target * 0.4) / 4);
  const fatTarget = Math.round((target * 0.3) / 9);

  const goal = profile.goal as Goal;

  const { recipes, source } = await suggestRecipes({
    goal,
    remainingCalories: Math.max(remaining, target),
  });

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {today}
          </p>
          <div className="mt-1 flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Today
            </h1>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${goalBadgeClass[goal]}`}>
              {GOALS[goal].label}
            </span>
          </div>
        </div>
      </div>

      <section className="mt-5 grid gap-4 sm:mt-6 lg:grid-cols-[1fr_1fr]">
        <div className="card relative overflow-hidden p-5 sm:p-6">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-500/5 to-transparent" />
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Calories
          </p>
          <div className="mt-3 flex items-center gap-4 sm:gap-6">
            <ProgressRing percent={percent} consumed={consumed} target={target} over={remaining < 0} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
                  {consumed}
                </span>
                <span className="text-base text-slate-500 dark:text-slate-400 sm:text-lg">/ {target}</span>
              </div>
              <p className="mt-1 text-sm">
                {remaining >= 0 ? (
                  <>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">{remaining}</span>{" "}
                    <span className="text-slate-600 dark:text-slate-400">kcal left today</span>
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">{Math.abs(remaining)}</span>{" "}
                    <span className="text-slate-600 dark:text-slate-400">kcal over goal</span>
                  </>
                )}
              </p>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full ${remaining < 0 ? "progress-over" : "progress-fill"}`}
                  style={{ width: `${Math.min(100, percent)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card p-5 sm:p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Macros today
          </p>
          <div className="mt-3 space-y-3">
            <MacroBar label="Protein" value={totalProtein} target={proteinTarget} color="emerald" />
            <MacroBar label="Carbs" value={totalCarbs} target={carbsTarget} color="amber" />
            <MacroBar label="Fat" value={totalFat} target={fatTarget} color="blue" />
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Targets based on a 30/40/30 split. Log macros when adding meals to track here.
          </p>
        </div>
      </section>

      <section className="mt-5 card p-5 sm:mt-6 sm:p-6">
        <div className="flex items-center gap-2">
          <IconPlus />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Log a meal</h2>
        </div>
        <div className="mt-4">
          <FoodForm />
        </div>
      </section>

      <section className="mt-5 card p-5 sm:mt-6 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Today&apos;s meals</h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {entries.length} {entries.length === 1 ? "meal" : "meals"}
          </span>
        </div>
        {entries.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900/40">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-800">
              <span className="text-xl">🍽️</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">No meals yet. Log your first one above.</p>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-slate-200/70 dark:divide-slate-800">
            {entries.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900 dark:text-slate-100">{e.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {e.proteinG ? `P ${e.proteinG}g · ` : ""}
                    {e.carbsG ? `C ${e.carbsG}g · ` : ""}
                    {e.fatG ? `F ${e.fatG}g · ` : ""}
                    {new Date(e.loggedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {e.calories} kcal
                </span>
                <form action={deleteFoodAction}>
                  <input type="hidden" name="id" value={e.id} />
                  <button
                    type="submit"
                    className="rounded-full p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                    aria-label={`Remove ${e.name}`}
                  >
                    <IconTrash />
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-5 card p-5 sm:mt-6 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Recipe ideas</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {source === "spoonacular" && "Fresh from Spoonacular — matched to your remaining calories."}
              {source === "cache" && "From cache — served instantly."}
              {source === "fallback" && "Sample recipes — add a Spoonacular key in .env for live results."}
            </p>
          </div>
          {source !== "fallback" && (
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              Live
            </span>
          )}
        </div>

        <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((r) => (
            <li
              key={r.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="relative h-44 w-full overflow-hidden">
                {r.image ? (
                  <Image
                    src={r.image}
                    alt={r.title}
                    width={400}
                    height={260}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 via-teal-100 to-amber-100 text-5xl dark:from-emerald-950/50 dark:via-teal-950/50 dark:to-amber-950/50">
                    🥗
                  </div>
                )}
                <div className="absolute top-3 left-3 rounded-full bg-black/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  {r.calories} kcal
                </div>
                {r.readyInMinutes ? (
                  <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-800 backdrop-blur">
                    {r.readyInMinutes} min
                  </div>
                ) : null}
              </div>
              <div className="p-4">
                <h3 className="line-clamp-2 min-h-[2.5rem] font-semibold text-slate-900 dark:text-slate-100">
                  {r.title}
                </h3>
                <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                  <MacroTag color="emerald">P {r.protein}g</MacroTag>
                  <MacroTag color="amber">C {r.carbs}g</MacroTag>
                  <MacroTag color="blue">F {r.fat}g</MacroTag>
                </div>
                {r.sourceUrl ? (
                  <a
                    href={r.sourceUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                  >
                    View recipe
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ProgressRing({
  percent,
  consumed,
  target,
  over,
}: {
  percent: number;
  consumed: number;
  target: number;
  over: boolean;
}) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const dash = (Math.min(percent, 100) / 100) * c;
  return (
    <div className="relative h-24 w-24 shrink-0 sm:h-32 sm:w-32">
      <svg viewBox="0 0 112 112" className="h-full w-full -rotate-90">
        <circle cx="56" cy="56" r={r} stroke="currentColor" strokeWidth="10" className="text-slate-200 dark:text-slate-800" fill="none" />
        <circle
          cx="56"
          cy="56"
          r={r}
          stroke={over ? "url(#ring-over)" : "url(#ring-ok)"}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          fill="none"
        />
        <defs>
          <linearGradient id="ring-ok" x1="0" y1="0" x2="112" y2="112" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#10b981" /><stop offset="1" stopColor="#14b8a6" />
          </linearGradient>
          <linearGradient id="ring-over" x1="0" y1="0" x2="112" y2="112" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#f59e0b" /><stop offset="1" stopColor="#f43f5e" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-bold text-slate-900 dark:text-slate-100 sm:text-xl">{Math.round((consumed / target) * 100)}%</span>
        <span className="text-[9px] text-slate-500 dark:text-slate-400 sm:text-[10px]">of target</span>
      </div>
    </div>
  );
}

function MacroBar({
  label,
  value,
  target,
  color,
}: {
  label: string;
  value: number;
  target: number;
  color: "emerald" | "amber" | "blue";
}) {
  const pct = Math.min(100, Math.round((value / Math.max(target, 1)) * 100));
  const bar =
    color === "emerald"
      ? "bg-gradient-to-r from-emerald-500 to-teal-500"
      : color === "amber"
      ? "bg-gradient-to-r from-amber-500 to-orange-500"
      : "bg-gradient-to-r from-blue-500 to-indigo-500";
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-800 dark:text-slate-200">{value}g</span>
          {" / "}
          {target}g
        </span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className={`h-full ${bar}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function MacroTag({
  color,
  children,
}: {
  color: "emerald" | "amber" | "blue";
  children: React.ReactNode;
}) {
  const cls =
    color === "emerald"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      : color === "amber"
      ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
      : "bg-blue-500/10 text-blue-700 dark:text-blue-400";
  return <span className={`rounded-full px-2 py-0.5 font-medium ${cls}`}>{children}</span>;
}

function IconPlus() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-emerald-600 dark:text-emerald-400">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" />
    </svg>
  );
}
