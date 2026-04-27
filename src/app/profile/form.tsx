"use client";

import { useActionState, useState } from "react";
import { saveProfileAction, type ProfileActionState } from "./actions";

type Option = { value: string; label: string };

type ProfileInitial = {
  sex: string;
  ageYears: number;
  heightCm: number;
  weightKg: number;
  activityLevel: string;
  goal: string;
  dailyCalorieTarget: number;
} | null;

const initialState: ProfileActionState = {};

const GOAL_META: Record<string, { emoji: string; tagline: string; tint: string }> = {
  cut: {
    emoji: "🔥",
    tagline: "Lose fat. Moderate calorie deficit.",
    tint: "from-amber-500/20 to-orange-500/10 border-amber-400/60",
  },
  maintain: {
    emoji: "⚖️",
    tagline: "Hold steady. Recomp territory.",
    tint: "from-blue-500/20 to-indigo-500/10 border-blue-400/60",
  },
  bulk: {
    emoji: "💪",
    tagline: "Gain muscle. Controlled surplus.",
    tint: "from-emerald-500/20 to-teal-500/10 border-emerald-400/60",
  },
};

export function ProfileForm({
  initial,
  activityLevels,
  goals,
}: {
  initial: ProfileInitial;
  activityLevels: Option[];
  goals: Option[];
}) {
  const [state, formAction, pending] = useActionState(saveProfileAction, initialState);
  const [goal, setGoal] = useState<string>(initial?.goal ?? "maintain");
  const [sex, setSex] = useState<string>(initial?.sex ?? "male");

  return (
    <form action={formAction} className="space-y-7">
      <Section title="You" subtitle="The basics we need for the formula.">
        <div>
          <span className="block text-sm font-medium text-slate-800 dark:text-slate-200">Sex</span>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <SegButton label="Male" active={sex === "male"} onClick={() => setSex("male")} />
            <SegButton label="Female" active={sex === "female"} onClick={() => setSex("female")} />
          </div>
          <input type="hidden" name="sex" value={sex} />
          {state.fieldErrors?.sex?.map((e) => (
            <span key={e} className="mt-1 block text-xs font-medium text-red-600">{e}</span>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Age"
            suffix="yrs"
            name="ageYears"
            type="number"
            min={10}
            max={100}
            required
            defaultValue={initial?.ageYears ?? ""}
            errors={state.fieldErrors?.ageYears}
          />
          <Input
            label="Height"
            suffix="cm"
            name="heightCm"
            type="number"
            step="0.1"
            min={100}
            max={250}
            required
            defaultValue={initial?.heightCm ?? ""}
            errors={state.fieldErrors?.heightCm}
          />
          <Input
            label="Weight"
            suffix="kg"
            name="weightKg"
            type="number"
            step="0.1"
            min={30}
            max={300}
            required
            defaultValue={initial?.weightKg ?? ""}
            errors={state.fieldErrors?.weightKg}
          />
        </div>
      </Section>

      <Section title="Activity" subtitle="How much do you move in a typical week?">
        <Select
          label="Activity level"
          name="activityLevel"
          defaultValue={initial?.activityLevel ?? "moderate"}
          options={activityLevels}
          errors={state.fieldErrors?.activityLevel}
        />
      </Section>

      <Section title="Your goal" subtitle="This determines your calorie adjustment.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {goals.map((g) => {
            const meta = GOAL_META[g.value];
            const active = goal === g.value;
            return (
              <button
                key={g.value}
                type="button"
                onClick={() => setGoal(g.value)}
                className={`relative rounded-2xl border p-4 text-left transition-all ${
                  active
                    ? `bg-gradient-to-br ${meta.tint} shadow-lg`
                    : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-slate-600"
                }`}
              >
                <div className="text-2xl">{meta.emoji}</div>
                <div className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{g.label}</div>
                <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{meta.tagline}</div>
                {active ? (
                  <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow dark:bg-slate-950">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                      <path d="m2 6 3 3 5-6" />
                    </svg>
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
        <input type="hidden" name="goal" value={goal} />
      </Section>

      {state.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
          {state.error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 px-6 py-3 font-medium text-white shadow-lg shadow-emerald-500/25 transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100 sm:w-auto sm:px-8"
      >
        {pending ? "Saving…" : initial ? "Update profile" : "Save and continue"}
      </button>
    </form>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section>
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function SegButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-900"
      }`}
    >
      {label}
    </button>
  );
}

function Input({
  label,
  suffix,
  errors,
  ...inputProps
}: {
  label: string;
  suffix?: string;
  errors?: string[];
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-800 dark:text-slate-200">{label}</span>
      <div className="relative mt-1.5">
        <input
          {...inputProps}
          className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:bg-slate-900"
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
            {suffix}
          </span>
        ) : null}
      </div>
      {errors?.map((e) => (
        <span key={e} className="mt-1 block text-xs font-medium text-red-600 dark:text-red-400">{e}</span>
      ))}
    </label>
  );
}

function Select({
  label,
  errors,
  options,
  ...selectProps
}: {
  label: string;
  errors?: string[];
  options: Option[];
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-800 dark:text-slate-200">{label}</span>
      <select
        {...selectProps}
        className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:bg-slate-900"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {errors?.map((e) => (
        <span key={e} className="mt-1 block text-xs font-medium text-red-600 dark:text-red-400">{e}</span>
      ))}
    </label>
  );
}
