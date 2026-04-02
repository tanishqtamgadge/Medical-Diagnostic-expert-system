import type { PredictionResult } from "@/types";

export function ResultCard({
  title,
  prediction
}: {
  title: string;
  prediction: PredictionResult;
}) {
  return (
    <article className="rounded-3xl border border-stone-200 dark:border-stone-700 bg-white/90 dark:bg-stone-800/90 p-5 shadow-sm">
      <p className="text-xs uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">{title}</p>
      <div className="mt-3 flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-ink dark:text-stone-100">{prediction.disease}</h3>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">{prediction.explanation}</p>
        </div>
        <div className="shrink-0 rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white">
          {prediction.probability}%
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl bg-stone-50 dark:bg-stone-900/50 p-3 text-sm">
          <p className="font-semibold text-ink dark:text-stone-200">Rule Score</p>
          <p className="dark:text-stone-400">{prediction.rule_score}%</p>
        </div>
        <div className="rounded-2xl bg-stone-50 dark:bg-stone-900/50 p-3 text-sm">
          <p className="font-semibold text-ink dark:text-stone-200">ML Score</p>
          <p className="dark:text-stone-400">{prediction.ml_score}%</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-semibold text-ink dark:text-stone-200">Matched Symptoms</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {prediction.matched_symptoms.map((symptom) => (
            <span key={symptom} className="rounded-full bg-amber dark:bg-amber/10 px-3 py-1 text-xs text-stone-700 dark:text-amber-200">
              {symptom}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-4 text-sm text-stone-700 dark:text-stone-300">{prediction.recommendation}</p>
    </article>
  );
}
