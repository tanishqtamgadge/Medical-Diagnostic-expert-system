"use client";

import { useState, useTransition } from "react";

import { createDiagnosis, downloadReport } from "@/lib/api";
import type { DiagnosisRequest, DiagnosisResponse, Severity, SymptomInput } from "@/types";
import { ResultCard } from "./result-card";
import { Skeleton } from "./skeleton";

const SYMPTOMS = [
  "fever", "cough", "sore throat", "body ache", "fatigue", "chills", "headache",
  "sneezing", "runny nose", "watery eyes", "loss of taste", "shortness of breath",
  "stomach pain", "weakness", "vomiting", "loss of appetite", "diarrhea",
  "sweating", "nausea", "dizziness", "itchy eyes", "rash", "skin irritation",
  "swollen tonsils", "ear pain", "chest pain"
];

export function SymptomForm() {
  const [pending, startTransition] = useTransition();
  const [reportPending, startReportTransition] = useTransition();
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<Record<string, Severity>>({});
  const [result, setResult] = useState<DiagnosisResponse | null>(null);
  const [error, setError] = useState("");

  const buildPayload = (): DiagnosisRequest => ({
    patient: {
      name: patientName || "Anonymous",
      age: age ? Number(age) : undefined,
      gender: gender || undefined
    },
    symptoms: Object.entries(selectedSymptoms).map(([name, severity]) => ({ name, severity }))
  });

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((current) => {
      if (current[symptom]) {
        const copy = { ...current };
        delete copy[symptom];
        return copy;
      }
      return { ...current, [symptom]: "medium" };
    });
  };

  const updateSeverity = (symptom: string, severity: Severity) => {
    setSelectedSymptoms((current) => ({ ...current, [symptom]: severity }));
  };

  const handleSubmit = () => {
    setError("");
    // Clear result while loading to show skeletons
    setResult(null); 
    startTransition(async () => {
      try {
        const response = await createDiagnosis(buildPayload());
        setResult(response);
      } catch (submitError) {
        setError(submitError instanceof Error ? submitError.message : "Something went wrong.");
      }
    });
  };

  const handleDownload = () => {
    setError("");
    startReportTransition(async () => {
      try {
        const blob = await downloadReport(buildPayload());
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "diagnosis-report.pdf";
        link.click();
        window.URL.revokeObjectURL(url);
      } catch (downloadError) {
        setError(downloadError instanceof Error ? downloadError.message : "Could not download report.");
      }
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-[2rem] border border-stone-200 dark:border-stone-700 bg-cream/90 dark:bg-stone-800/90 p-6 shadow-lg shadow-stone-200/60 dark:shadow-none">
        <p className="text-xs uppercase tracking-[0.35em] text-stone-500 dark:text-stone-400">Symptom Intake</p>
        <h2 className="mt-3 text-3xl font-semibold text-ink dark:text-stone-100">Start a diagnostic session</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600 dark:text-stone-400">
          Select symptoms, assign severity, and run the diagnosis.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <input
            value={patientName}
            onChange={(event) => setPatientName(event.target.value)}
            placeholder="Patient name"
            className="rounded-2xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 px-4 py-3 text-sm text-ink dark:text-stone-100 outline-none"
          />
          <input
            value={age}
            onChange={(event) => setAge(event.target.value)}
            placeholder="Age"
            type="number"
            className="rounded-2xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 px-4 py-3 text-sm text-ink dark:text-stone-100 outline-none"
          />
          <input
            value={gender}
            onChange={(event) => setGender(event.target.value)}
            placeholder="Gender"
            className="rounded-2xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 px-4 py-3 text-sm text-ink dark:text-stone-100 outline-none"
          />
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {SYMPTOMS.map((symptom) => {
            const isSelected = Boolean(selectedSymptoms[symptom]);
            return (
              <div
                key={symptom}
                className={`rounded-2xl border p-4 transition ${
                  isSelected 
                    ? "border-sage dark:border-sage bg-white dark:bg-stone-700 shadow-sm" 
                    : "border-stone-200 dark:border-stone-700 bg-stone-50/80 dark:bg-stone-900/50"
                }`}
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSymptom(symptom)}
                    className="h-4 w-4 accent-[#17624a] cursor-pointer"
                  />
                  <span className="text-sm font-medium capitalize text-ink dark:text-stone-200">{symptom}</span>
                </label>
                {isSelected ? (
                  <select
                    value={selectedSymptoms[symptom]}
                    onChange={(event) => updateSeverity(symptom, event.target.value as Severity)}
                    className="mt-3 w-full rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2 text-sm dark:text-stone-200 outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleSubmit}
            disabled={pending || Object.keys(selectedSymptoms).length === 0}
            className="rounded-full bg-sage px-6 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-sage/90"
          >
            {pending ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Analyzing...
              </span>
            ) : "Run Diagnosis"}
          </button>
          
          {result && (
            <>
              <button
                onClick={handleDownload}
                disabled={reportPending || Object.keys(selectedSymptoms).length === 0}
                className="rounded-full border border-stone-300 dark:border-stone-600 px-6 py-3 text-sm font-semibold text-ink dark:text-stone-200 transition hover:bg-stone-100 dark:hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {reportPending ? "Preparing PDF..." : "Download Report"}
              </button>
            </>
          )}
        </div>

        {error ? <p className="mt-4 text-sm text-red-700 dark:text-red-400">{error}</p> : null}
      </section>

      <section className="rounded-[2rem] border border-stone-200 dark:border-stone-700 bg-white/85 dark:bg-stone-800/85 p-6 shadow-lg shadow-stone-200/50 dark:shadow-none transition-all">
        <p className="text-xs uppercase tracking-[0.35em] text-stone-500 dark:text-stone-400">Live Results</p>
        
        {pending ? (
          <div className="mt-4 space-y-4">
            <Skeleton variant="card" className="h-[200px]" />
            <Skeleton variant="card" className="h-[150px]" />
            <Skeleton variant="card" className="h-[150px]" />
          </div>
        ) : result ? (
          <div className="mt-4 space-y-4">
            {result.red_flags.length ? (
              <div className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-800 dark:text-red-300">
                Red flag symptoms: {result.red_flags.join(", ")}
              </div>
            ) : null}
            <ResultCard title="Top Prediction" prediction={result.top_prediction} />
            {result.alternatives.map((prediction, index) => (
              <ResultCard key={prediction.disease} title={`Alternative ${index + 1}`} prediction={prediction} />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-3xl border border-dashed border-stone-300 dark:border-stone-600 bg-stone-50/80 dark:bg-stone-900/50 p-8 text-sm text-stone-600 dark:text-stone-400 text-center">
            Results will appear here after you run a diagnosis.
          </div>
        )}
      </section>
    </div>
  );
}
