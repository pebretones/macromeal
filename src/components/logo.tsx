export function Logo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#10b981" />
          <stop offset="1" stopColor="#0f766e" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="28" height="28" rx="9" fill="url(#logo-grad)" />
      <path
        d="M16 8.5c4.5 0 7.5 3 7.5 6.5s-3 6.5-7.5 6.5a7.5 7.5 0 0 1 0-13Z"
        fill="white"
        fillOpacity="0.95"
      />
      <path
        d="M16 8.5v13"
        stroke="#0f766e"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="22" cy="22" r="3" fill="#f59e0b" stroke="white" strokeWidth="1.5" />
    </svg>
  );
}

export function LogoWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <Logo />
      <span className="text-lg font-bold tracking-tight">
        Macro<span className="text-emerald-600 dark:text-emerald-400">Meal</span>
      </span>
    </span>
  );
}
