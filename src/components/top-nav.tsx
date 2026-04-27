import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Logo } from "@/components/logo";

async function logoutAction() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export async function TopNav() {
  const session = await auth();
  const loggedIn = !!session?.user?.id;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/60 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
        <Link
          href={loggedIn ? "/dashboard" : "/"}
          className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Logo className="h-7 w-7 sm:h-8 sm:w-8" />
          <span className="hidden text-lg font-bold tracking-tight sm:inline">
            Macro<span className="text-emerald-600 dark:text-emerald-400">Meal</span>
          </span>
        </Link>
        <nav className="flex min-w-0 items-center gap-1 text-sm">
          {loggedIn ? (
            <>
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/profile">Profile</NavLink>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="rounded-full px-3 py-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800"
                  aria-label="Log out"
                >
                  <span className="hidden sm:inline">Log out</span>
                  <IconLogout className="h-5 w-5 sm:hidden" />
                </button>
              </form>
            </>
          ) : (
            <>
              <NavLink href="/login">Log in</NavLink>
              <Link
                href="/signup"
                className="rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 px-3 py-2 text-sm font-medium text-white shadow-lg shadow-emerald-500/25 transition-transform hover:scale-[1.02] sm:px-4"
              >
                <span className="hidden sm:inline">Get started</span>
                <span className="sm:hidden">Sign up</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full px-3 py-2 text-slate-700 transition-colors hover:bg-slate-100 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
    >
      {children}
    </Link>
  );
}

function IconLogout({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}
