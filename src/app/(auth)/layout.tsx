import { Logo } from "@/components/logo";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-2 lg:gap-12">
      <div className="relative hidden lg:block">
        <div className="absolute -inset-10 -z-10 rounded-[3rem] bg-gradient-to-br from-emerald-200/60 via-teal-200/50 to-amber-200/40 blur-3xl dark:from-emerald-900/40 dark:via-teal-900/30 dark:to-amber-900/20" />
        <Link href="/" className="inline-flex items-center gap-3">
          <Logo className="h-10 w-10" />
          <span className="text-xl font-bold tracking-tight">
            Macro<span className="text-emerald-600 dark:text-emerald-400">Meal</span>
          </span>
        </Link>
        <h2 className="mt-8 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Track what matters.
          <br />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            Skip the spreadsheets.
          </span>
        </h2>
        <ul className="mt-8 space-y-3 text-slate-600 dark:text-slate-400">
          <FeatureRow>Science-backed daily target (Mifflin-St Jeor)</FeatureRow>
          <FeatureRow>Recipes sized to your remaining calories</FeatureRow>
          <FeatureRow>Works on any device — no app install</FeatureRow>
          <FeatureRow>Your data stays private</FeatureRow>
        </ul>
      </div>

      <div className="card mx-auto w-full max-w-md p-6 shadow-2xl shadow-emerald-500/10 sm:p-8">
        {children}
      </div>
    </div>
  );
}

function FeatureRow({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m2 6 3 3 5-6" />
        </svg>
      </span>
      <span className="text-sm leading-relaxed">{children}</span>
    </li>
  );
}
