"use client";

import Link from "next/link";
import { useAuth } from "./auth-provider";
import { useTheme } from "./theme-provider";

export function Navbar() {
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 border-b border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-stone-900/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 text-ink dark:text-stone-100 font-semibold tracking-tight">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-sage" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 2v8m0 0v8m0-8H4m8 0h8" strokeLinecap="round" />
          </svg>
          <span className="hidden sm:inline">Medical Diagnostic</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-300 transition hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            {theme === "dark" ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M12 3a6 6 0 009 5.197A9 9 0 1112 3z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            )}
          </button>

          {/* Auth */}
          {loading ? null : user ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-stone-600 dark:text-stone-300 sm:inline">
                {user.full_name || user.email}
              </span>
              <button
                onClick={logout}
                className="rounded-full border border-stone-300 dark:border-stone-600 px-4 py-1.5 text-xs font-semibold text-ink dark:text-stone-200 transition hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-sage px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-sage/90"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
