"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type AuthActionState } from "../actions";

const initialState: AuthActionState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Log in to continue tracking.</p>

      <form action={formAction} className="mt-8 space-y-5">
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          errors={state.fieldErrors?.email}
        />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          errors={state.fieldErrors?.password}
        />

        {state.error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
            {state.error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 px-6 py-3 font-medium text-white shadow-lg shadow-emerald-500/25 transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100"
        >
          {pending ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-emerald-700 hover:underline dark:text-emerald-400">
          Sign up
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  errors,
  ...inputProps
}: {
  label: string;
  errors?: string[];
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-800 dark:text-slate-200">{label}</span>
      <input
        {...inputProps}
        className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:bg-slate-900"
      />
      {errors?.map((e) => (
        <span key={e} className="mt-1 block text-xs font-medium text-red-600 dark:text-red-400">{e}</span>
      ))}
    </label>
  );
}
