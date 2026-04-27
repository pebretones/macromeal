"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addFoodAction, type FoodActionState } from "./actions";

const initialState: FoodActionState = {};

export function FoodForm() {
  const [state, formAction, pending] = useActionState(addFoodAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [showMacros, setShowMacros] = useState(false);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setShowMacros(false);
    }
  }, [state.ok]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr]">
        <Field label="What did you eat?" error={state.fieldErrors?.name?.[0]}>
          <input
            name="name"
            required
            placeholder="e.g. Chicken salad"
            className={inputCls}
          />
        </Field>
        <Field label="Calories" error={state.fieldErrors?.calories?.[0]}>
          <div className="relative">
            <input
              name="calories"
              type="number"
              min={0}
              max={10000}
              required
              placeholder="450"
              className={inputCls}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
              kcal
            </span>
          </div>
        </Field>
      </div>

      {showMacros ? (
        <div className="grid grid-cols-3 gap-3 rounded-xl bg-slate-50/60 p-3 dark:bg-slate-900/40">
          <Field label="Protein" small>
            <div className="relative">
              <input name="proteinG" type="number" step="0.1" min={0} placeholder="0" className={inputCls} />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">g</span>
            </div>
          </Field>
          <Field label="Carbs" small>
            <div className="relative">
              <input name="carbsG" type="number" step="0.1" min={0} placeholder="0" className={inputCls} />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">g</span>
            </div>
          </Field>
          <Field label="Fat" small>
            <div className="relative">
              <input name="fatG" type="number" step="0.1" min={0} placeholder="0" className={inputCls} />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">g</span>
            </div>
          </Field>
        </div>
      ) : null}

      {state.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setShowMacros((s) => !s)}
          className="text-xs font-medium text-slate-600 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400"
        >
          {showMacros ? "− Hide macros" : "+ Add macros (optional)"}
        </button>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 px-5 py-2 text-sm font-medium text-white shadow-md shadow-emerald-500/20 transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
        >
          {pending ? "Adding…" : "Add meal"}
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:bg-slate-900";

function Field({
  label,
  error,
  small,
  children,
}: {
  label: string;
  error?: string;
  small?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={`block font-medium text-slate-700 dark:text-slate-300 ${small ? "text-[11px]" : "text-xs"}`}>
        {label}
      </span>
      <div className="mt-1">{children}</div>
      {error ? <span className="mt-1 block text-xs font-medium text-red-600">{error}</span> : null}
    </label>
  );
}
