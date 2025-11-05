import { HeartPulse, Activity, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-white/70 dark:bg-neutral-900/70 border-b border-neutral-200/60 dark:border-neutral-800/60">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
            <HeartPulse size={20} />
          </div>
          <div>
            <h1 className="font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
              AgeAlign
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Align your biological and chronological age
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300">
            <span className="inline-flex items-center gap-1"><Activity size={16}/> Dashboard</span>
            <span className="inline-flex items-center gap-1"><HeartPulse size={16}/> Biomarkers</span>
          </div>
          <button
            aria-label="Toggle theme"
            onClick={() => setDark(v => !v)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
            <span className="text-sm hidden sm:inline">{dark ? "Light" : "Dark"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
