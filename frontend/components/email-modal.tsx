"use client";

import { useState } from "react";
import { emailReport } from "@/lib/api";
import type { DiagnosisRequest } from "@/types";

interface EmailModalProps {
  requestPayload: DiagnosisRequest;
  onClose: () => void;
}

export function EmailModal({ requestPayload, onClose }: EmailModalProps) {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setError("");
    setPending(true);
    try {
      await emailReport({
        ...requestPayload,
        recipient_email: email,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send email");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-stone-800 p-6 shadow-xl border border-stone-200 dark:border-stone-700">
        <h3 className="text-xl font-semibold text-ink dark:text-stone-100">Email Report</h3>
        
        {success ? (
          <div className="mt-4">
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Report sent successfully to <strong className="text-ink dark:text-stone-200">{email}</strong>.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white transition hover:bg-sage/90"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4">
            <p className="mb-4 text-sm text-stone-600 dark:text-stone-400">
              Enter an email address to receive the PDF diagnosis report.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="recipient@example.com"
              required
              className="w-full rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-700 px-4 py-2 text-sm text-ink dark:text-stone-100 outline-none placeholder:text-stone-400 focus:border-sage"
            />
            {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={pending}
                className="rounded-full px-4 py-2 text-sm font-semibold text-stone-600 dark:text-stone-300 transition hover:bg-stone-100 dark:hover:bg-stone-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={pending || !email}
                className="rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white transition hover:bg-sage/90 disabled:opacity-50"
              >
                {pending ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
