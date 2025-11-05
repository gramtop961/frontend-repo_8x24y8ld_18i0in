import { Gauge, ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function Dashboard({ result, history }) {
  const bio = result?.biological_age ?? null;
  const chrono = result?.chronological_age ?? null;
  const gap = result?.age_gap ?? null;

  return (
    <section className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
            <Gauge size={18} />
          </div>
          <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">Your Dashboard</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Biological Age" value={bio ? bio.toFixed(1) + " yrs" : "–"} subtitle="Calculated with Phenotypic Age"/>
        <Card title="Chronological Age" value={chrono ? chrono.toFixed(1) + " yrs" : "–"} subtitle="From your input"/>
        <Card title="Age Gap" value={gap ? `${gap.toFixed(1)} yrs` : "–"} subtitle={gap != null ? (gap > 0 ? "Biological > Chronological" : "Biological < Chronological") : ""} highlight={gap}/>
      </div>

      <div className="mt-6">
        <ProgressChart history={history} />
      </div>
    </section>
  );
}

function Card({ title, value, subtitle, highlight }) {
  const positive = Number(highlight) > 0;
  const negative = Number(highlight) < 0;
  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 bg-neutral-50 dark:bg-neutral-950">
      <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">{title}</div>
      <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
        {value}
        {positive && <span className="text-red-600 dark:text-red-400 inline-flex items-center text-sm"><ArrowUpRight size={16}/> Faster</span>}
        {negative && <span className="text-emerald-600 dark:text-emerald-400 inline-flex items-center text-sm"><ArrowDownRight size={16}/> Slower</span>}
      </div>
      {subtitle && <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{subtitle}</div>}
    </div>
  );
}

function ProgressChart({ history }) {
  // Simple responsive sparkline using SVG; expects history: [{date, biological_age, chronological_age}]
  const width = 700;
  const height = 160;
  const padding = 24;
  const points = history ?? [];

  if (!points.length) {
    return (
      <div className="border border-dashed border-neutral-300 dark:border-neutral-800 rounded-lg p-6 text-center text-neutral-500 dark:text-neutral-400">
        Add biomarker entries to track your progress over time.
      </div>
    );
  }

  const xs = points.map((_, i) => i);
  const ysBio = points.map(p => p.biological_age);
  const ysChrono = points.map(p => p.chronological_age);
  const minX = 0, maxX = Math.max(xs.length - 1, 1);
  const minY = Math.min(...ysBio, ...ysChrono) - 2;
  const maxY = Math.max(...ysBio, ...ysChrono) + 2;
  const xScale = (x) => padding + (x - minX) / (maxX - minX) * (width - padding * 2);
  const yScale = (y) => height - padding - (y - minY) / (maxY - minY) * (height - padding * 2);

  const pathFrom = (ys) => ys.map((y, i) => `${i === 0 ? "M" : "L"} ${xScale(xs[i]).toFixed(2)} ${yScale(y).toFixed(2)}`).join(" ");

  return (
    <div className="w-full overflow-x-auto">
      <svg width={width} height={height} className="min-w-full">
        <defs>
          <linearGradient id="gradBio" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradChrono" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Axes */}
        <line x1={padding} x2={width - padding} y1={height - padding} y2={height - padding} stroke="#e5e7eb" />
        <line x1={padding} x2={padding} y1={padding} y2={height - padding} stroke="#e5e7eb" />

        {/* Biological Age */}
        <path d={pathFrom(ysBio)} fill="none" stroke="#10b981" strokeWidth="2" />
        <path d={`${pathFrom(ysBio)} L ${xScale(maxX)} ${height - padding} L ${xScale(minX)} ${height - padding} Z`} fill="url(#gradBio)" opacity="0.3"/>

        {/* Chronological Age */}
        <path d={pathFrom(ysChrono)} fill="none" stroke="#3b82f6" strokeWidth="2" />
        <path d={`${pathFrom(ysChrono)} L ${xScale(maxX)} ${height - padding} L ${xScale(minX)} ${height - padding} Z`} fill="url(#gradChrono)" opacity="0.25"/>

        {/* Dots */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={xScale(xs[i])} cy={yScale(p.biological_age)} r={3} fill="#10b981" />
            <circle cx={xScale(xs[i])} cy={yScale(p.chronological_age)} r={3} fill="#3b82f6" />
          </g>
        ))}
      </svg>
      <div className="flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-300 mt-2">
        <div className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"/> Biological</div>
        <div className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"/> Chronological</div>
      </div>
    </div>
  );
}
