"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { SymptomForm } from "@/components/symptom-form";
import { useAuth } from "@/components/auth-provider";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sage border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10 md:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[2.5rem] border border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/60 p-8 shadow-xl shadow-stone-200/60 dark:shadow-none backdrop-blur-md">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.45em] text-stone-500 dark:text-stone-400">Intelligent Health Assessment</p>
              <h1 className="mt-4 text-5xl font-medium leading-tight text-ink dark:text-stone-50">
                Medical Diagnostic Expert System
              </h1>
              <p className="mt-4 text-base leading-7 text-stone-600 dark:text-stone-300">
                Evaluate symptoms with severity-based intake, get probabilistic predictions,
                track your diagnosis history, and download detailed reports.
              </p>
            </div>
            {user && (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-stone-300 dark:border-stone-700 bg-white/50 dark:bg-stone-800/80 px-6 py-3 text-sm font-semibold text-ink dark:text-stone-100 transition hover:bg-stone-100 dark:hover:bg-stone-700 backdrop-blur-sm"
              >
                Open Dashboard
              </Link>
            )}
          </div>
        </div>

        <div className="mt-10">
          <SymptomForm />
        </div>
      </section>
    </main>
  );
}
