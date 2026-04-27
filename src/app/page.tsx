import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  if (session?.user?.id) redirect("/dashboard");

  return (
    <div className="relative overflow-hidden">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />

      <section className="relative mx-auto max-w-6xl px-4 pt-12 pb-12 sm:px-6 sm:pt-20 sm:pb-16 lg:pt-28 lg:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Free · No ads · Your data stays yours
            </span>

            <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 dark:text-slate-50 sm:mt-6 sm:text-5xl md:text-6xl lg:text-7xl">
              Eat toward{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                your goal
              </span>
              <br className="hidden sm:block" />
              {" "}without the math.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:mt-6 sm:text-lg lg:text-xl">
              MacroMeal sets your daily calorie target for <b>bulking</b>, <b>cutting</b>, or{" "}
              <b>maintaining</b>, tracks what you eat, and suggests recipes that fit what you have left today.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/signup"
                className="rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 px-6 py-3 text-center text-base font-medium text-white shadow-lg shadow-emerald-500/30 transition-transform hover:scale-[1.03]"
              >
                Get started — free
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-slate-300 bg-white/70 px-6 py-3 text-center text-base font-medium text-slate-800 backdrop-blur transition-colors hover:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                I have an account
              </Link>
            </div>

            <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 sm:mt-10 sm:gap-6">
              <Stat value="Mifflin" label="St Jeor formula" />
              <Stat value="3 goals" label="Cut · Maintain · Bulk" />
              <Stat value="Live" label="Recipe search" />
            </dl>
          </div>

          <DashboardPreview />
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
          <Feature
            icon={<IconTarget />}
            title="Your number, calculated"
            body="Enter age, weight, height, activity level once. We compute your target with the Mifflin-St Jeor formula, then adjust for your goal."
          />
          <Feature
            icon={<IconBolt />}
            title="Log in seconds"
            body="Add a meal with a name and calorie count. Optionally track protein, carbs, and fat. Watch your remaining calories live."
          />
          <Feature
            icon={<IconChef />}
            title="Recipes that fit"
            body="Recipe ideas filtered to the calories you have left and tuned for your goal — high-protein for bulk, lean for cut."
          />
        </div>
      </section>

      <section className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl md:text-4xl">
          Ready to stop guessing?
        </h2>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-400 sm:text-lg">
          Set up your profile in under a minute.
        </p>
        <Link
          href="/signup"
          className="mt-7 inline-block rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 px-8 py-4 text-base font-medium text-white shadow-xl shadow-emerald-500/30 transition-transform hover:scale-[1.03] sm:mt-8"
        >
          Create my account
        </Link>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="text-lg font-bold text-slate-900 dark:text-slate-100">{value}</dt>
      <dd className="text-xs text-slate-500 dark:text-slate-400">{label}</dd>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="card group p-6 transition-transform hover:-translate-y-0.5">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 text-emerald-700 dark:text-emerald-400">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{body}</p>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-emerald-200/50 via-teal-200/40 to-amber-200/40 blur-2xl dark:from-emerald-900/40 dark:via-teal-900/30 dark:to-amber-900/20" />
      <div className="card p-4 shadow-2xl shadow-emerald-500/10 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 sm:text-xs">
              Today
            </p>
            <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
              Goal · <span className="goal-bulk rounded-full px-2 py-0.5 text-xs font-semibold">Bulk</span>
            </p>
          </div>
          <RingSVG percent={62} calories={1742} target={2800} />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-3">
          <MacroPill label="Protein" value={128} unit="g" color="emerald" pct={0.72} />
          <MacroPill label="Carbs" value={194} unit="g" color="amber" pct={0.55} />
          <MacroPill label="Fat" value={52} unit="g" color="blue" pct={0.48} />
        </div>

        <div className="mt-5 space-y-2 sm:mt-6">
          {[
            { n: "Greek yogurt + berries", c: 280 },
            { n: "Grilled chicken rice bowl", c: 640 },
            { n: "Protein smoothie", c: 420 },
          ].map((m) => (
            <div
              key={m.n}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/60 bg-white/70 px-3 py-2.5 text-sm dark:border-slate-700/60 dark:bg-slate-900/60 sm:px-4"
            >
              <span className="truncate text-slate-800 dark:text-slate-200">{m.n}</span>
              <span className="shrink-0 font-medium text-slate-500 dark:text-slate-400">{m.c} kcal</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RingSVG({ percent, calories, target }: { percent: number; calories: number; target: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const dash = (percent / 100) * c;
  return (
    <div className="relative h-24 w-24">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle cx="40" cy="40" r={r} stroke="currentColor" strokeWidth="8" className="text-slate-200 dark:text-slate-800" fill="none" />
        <circle
          cx="40"
          cy="40"
          r={r}
          stroke="url(#ring-grad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          fill="none"
        />
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#10b981" />
            <stop offset="1" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold leading-none text-slate-900 dark:text-slate-100">{calories}</span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400">/ {target}</span>
      </div>
    </div>
  );
}

function MacroPill({
  label,
  value,
  unit,
  color,
  pct,
}: {
  label: string;
  value: number;
  unit: string;
  color: "emerald" | "amber" | "blue";
  pct: number;
}) {
  const track =
    color === "emerald"
      ? "bg-emerald-500"
      : color === "amber"
      ? "bg-amber-500"
      : "bg-blue-500";
  return (
    <div className="rounded-xl border border-slate-200/60 bg-white/70 p-2.5 dark:border-slate-700/60 dark:bg-slate-900/60 sm:p-3">
      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-0.5 text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg">
        {value}
        <span className="ml-0.5 text-xs font-normal text-slate-500">{unit}</span>
      </p>
      <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className={`h-full ${track}`} style={{ width: `${pct * 100}%` }} />
      </div>
    </div>
  );
}

/* Icons */
function IconTarget() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}
function IconBolt() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z" />
    </svg>
  );
}
function IconChef() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 21h12M7 17h10M17 8a4 4 0 0 0-4-4 4 4 0 0 0-4-4 4 4 0 0 0-2 7.5V17h12V7.5A4 4 0 0 0 17 8Z" />
    </svg>
  );
}
