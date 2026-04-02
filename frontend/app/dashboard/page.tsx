"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchHistory } from "@/lib/api";
import type { HistoryRecord } from "@/types";
import { Skeleton } from "@/components/skeleton";

export default function DashboardPage() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory()
      .then(setRecords)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unable to load history.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen px-6 py-10 md:px-10">
      <section className="mx-auto max-w-6xl rounded-[2rem] border border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-800/80 p-8 shadow-xl shadow-stone-200/60 dark:shadow-none backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-stone-500 dark:text-stone-400">Dashboard</p>
            <h1 className="mt-3 text-4xl text-ink dark:text-stone-100">Diagnosis history</h1>
          </div>
          <Link href="/" className="rounded-full border border-stone-300 dark:border-stone-600 px-5 py-3 text-sm font-semibold text-ink dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition">
            Back to Intake
          </Link>
        </div>

        {error ? <p className="mt-6 text-sm text-red-700 dark:text-red-400">{error}</p> : null}

        <div className="mt-8 overflow-hidden rounded-3xl border border-stone-200 dark:border-stone-700">
          <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-700">
            <thead className="bg-stone-50 dark:bg-stone-900/50">
              <tr className="text-left text-sm text-stone-600 dark:text-stone-400">
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Prediction</th>
                <th className="px-6 py-4">Probability</th>
                <th className="px-6 py-4">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-700/50 bg-white dark:bg-stone-800 text-sm dark:text-stone-300">
              {loading ? (
                // Skeleton loading state
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-36" /></td>
                  </tr>
                ))
              ) : records.length ? (
                records.map((record) => (
                  <tr key={record.id} className="transition hover:bg-stone-50/50 dark:hover:bg-stone-700/30">
                    <td className="px-6 py-4">{record.patient_name}</td>
                    <td className="px-6 py-4">{record.predicted_disease}</td>
                    <td className="px-6 py-4">{record.probability}%</td>
                    <td className="px-6 py-4">{new Date(record.created_at).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-stone-500 dark:text-stone-500">
                    No history yet. Submit a diagnosis from the intake page first.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
