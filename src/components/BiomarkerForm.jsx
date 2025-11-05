import { useState } from "react";
import { FlaskConical, Save } from "lucide-react";

function numberOrEmpty(value) {
  if (value === "" || value === null || value === undefined) return "";
  const n = Number(value);
  return Number.isFinite(n) ? n : "";
}

export default function BiomarkerForm({ onCalculate }) {
  const [form, setForm] = useState({
    albumin: "",
    creatinine: "",
    glucose: "",
    crp: "",
    mcv: "",
    rdw: "",
    alp: "",
    wbc: "",
    chronological_age: "",
  });

  const [error, setError] = useState("");

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        albumin: parseFloat(form.albumin),
        creatinine: parseFloat(form.creatinine),
        glucose: parseFloat(form.glucose),
        crp: parseFloat(form.crp),
        mcv: parseFloat(form.mcv),
        rdw: parseFloat(form.rdw),
        alkaline_phosphatase: parseFloat(form.alp),
        wbc: parseFloat(form.wbc),
        chronological_age: parseFloat(form.chronological_age),
      };

      const missing = Object.entries(payload).filter(([, v]) => !Number.isFinite(v));
      if (missing.length > 0) {
        setError("Please provide valid numbers for all fields.");
        return;
      }
      if (payload.crp <= 0) {
        setError("CRP must be greater than 0 to compute the formula (logarithm).");
        return;
      }

      onCalculate(payload);
    } catch (err) {
      setError("Unable to calculate. Check inputs.");
    }
  };

  const inputClass =
    "w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/60";

  return (
    <section className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-md bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
          <FlaskConical size={18} />
        </div>
        <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">Enter Biomarkers</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Field label="Albumin (g/dL)"><input className={inputClass} value={form.albumin} onChange={update("albumin")} inputMode="decimal"/></Field>
        <Field label="Creatinine (mg/dL)"><input className={inputClass} value={form.creatinine} onChange={update("creatinine")} inputMode="decimal"/></Field>
        <Field label="Glucose (mg/dL)"><input className={inputClass} value={form.glucose} onChange={update("glucose")} inputMode="decimal"/></Field>
        <Field label="CRP (mg/L)"><input className={inputClass} value={form.crp} onChange={update("crp")} inputMode="decimal"/></Field>
        <Field label="MCV (fL)"><input className={inputClass} value={form.mcv} onChange={update("mcv")} inputMode="decimal"/></Field>
        <Field label="RDW (%)"><input className={inputClass} value={form.rdw} onChange={update("rdw")} inputMode="decimal"/></Field>
        <Field label="Alkaline Phosphatase (U/L)"><input className={inputClass} value={form.alp} onChange={update("alp")} inputMode="decimal"/></Field>
        <Field label="WBC (10^9/L)"><input className={inputClass} value={form.wbc} onChange={update("wbc")} inputMode="decimal"/></Field>
        <Field label="Chronological Age (years)"><input className={inputClass} value={form.chronological_age} onChange={update("chronological_age")} inputMode="decimal"/></Field>

        {error && (
          <div className="sm:col-span-2 lg:col-span-3 text-sm text-red-600 dark:text-red-400">{error}</div>
        )}

        <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
          <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[.99]">
            <Save size={16}/> Calculate & Save
          </button>
        </div>
      </form>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs text-neutral-500 dark:text-neutral-400 mb-1">{label}</span>
      {children}
    </label>
  );
}
