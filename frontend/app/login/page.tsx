"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-56px)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-800/80 p-8 shadow-xl backdrop-blur">
        <p className="text-xs uppercase tracking-[0.4em] text-stone-500 dark:text-stone-400">Welcome Back</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink dark:text-stone-100">Sign in</h1>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
          Enter your credentials to access your account.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-2xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-700 px-4 py-3 text-sm text-ink dark:text-stone-100 outline-none placeholder:text-stone-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-2xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-700 px-4 py-3 text-sm text-ink dark:text-stone-100 outline-none placeholder:text-stone-400"
          />
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-sage px-6 py-3 text-sm font-semibold text-white transition hover:bg-sage/90 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500 dark:text-stone-400">
          Don&rsquo;t have an account?{" "}
          <Link href="/register" className="font-semibold text-sage hover:underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
