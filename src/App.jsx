import { useMemo, useState } from "react";
import Header from "./components/Header";
import BiomarkerForm from "./components/BiomarkerForm";
import Dashboard from "./components/Dashboard";
import Recommendations from "./components/Recommendations";

export default function App() {
  const [history, setHistory] = useState([]);
  const latest = history[history.length - 1] || null;

  const handleCalculate = (payload) => {
    const result = calculatePhenotypicAge(payload);
    const entry = {
      date: new Date().toISOString(),
      biological_age: result.biological_age,
      chronological_age: payload.chronological_age,
      age_gap: result.biological_age - payload.chronological_age,
      ...payload,
    };
    setHistory((h) => [...h, entry]);
  };

  const summary = useMemo(() => {
    if (!latest) return null;
    const age_gap = latest.biological_age - latest.chronological_age;
    return {
      biological_age: latest.biological_age,
      chronological_age: latest.chronological_age,
      age_gap,
    };
  }, [latest]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <Hero />
        <Dashboard result={summary} history={history} />
        <BiomarkerForm onCalculate={handleCalculate} />
        <Recommendations ageGap={summary?.age_gap} latest={latest} />
      </main>
      <footer className="py-8 text-center text-xs text-neutral-500 dark:text-neutral-400">
        © {new Date().getFullYear()} AgeAlign. This demo computes Phenotypic Age client-side for visualization.
      </footer>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-neutral-900 dark:to-neutral-900 p-6">
      <div className="relative z-10">
        <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
          Measure your biological age. Align your lifestyle.
        </h2>
        <p className="mt-2 text-neutral-700 dark:text-neutral-300 max-w-2xl">
          AgeAlign estimates your biological age using your lab values and offers clear, personalized
          recommendations to help you close the gap with your chronological age over time.
        </p>
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(600px_200px_at_10%_-20%,rgba(16,185,129,0.25),transparent),radial-gradient(500px_180px_at_90%_120%,rgba(59,130,246,0.25),transparent)]" />
    </section>
  );
}

function calculatePhenotypicAge({
  albumin,
  creatinine,
  glucose,
  crp,
  mcv,
  rdw,
  alkaline_phosphatase,
  wbc,
  chronological_age,
}) {
  // Levine et al., 2018 Phenotypic Age
  const mortality_score =
    -19.907 - 0.0336 * albumin + 0.0095 * creatinine + 0.1953 * glucose + 0.0954 * Math.log(crp) - 0.012 * mcv + 0.0268 * rdw + 0.3306 * alkaline_phosphatase + 0.00188 * wbc + 0.0554 * chronological_age;

  const phenotypic_age = 141.5 + Math.log(mortality_score + 0.00553) / 0.09165;

  return { biological_age: phenotypic_age };
}
