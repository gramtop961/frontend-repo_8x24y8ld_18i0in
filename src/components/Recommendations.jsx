import { Lightbulb, Salad, Dumbbell, Bed, Lotus } from "lucide-react";

export default function Recommendations({ ageGap, latest }) {
  const gap = Number(ageGap);

  const level = gap > 5 ? "high" : gap > 0 ? "moderate" : gap < -3 ? "low" : "aligned";

  const items = buildRecommendations(level, latest);

  return (
    <section className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-md bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
          <Lightbulb size={18} />
        </div>
        <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">Personalized Recommendations</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RecCard icon={<Salad size={18}/>} title="Nutrition" list={items.diet}/>
        <RecCard icon={<Dumbbell size={18}/>} title="Exercise" list={items.exercise}/>
        <RecCard icon={<Bed size={18}/>} title="Sleep" list={items.sleep}/>
        <RecCard icon={<Lotus size={18}/>} title="Stress" list={items.stress}/>
      </div>
    </section>
  );
}

function RecCard({ icon, title, list }) {
  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 bg-neutral-50 dark:bg-neutral-950">
      <div className="flex items-center gap-2 mb-2 text-neutral-800 dark:text-neutral-100">
        {icon}
        <h3 className="font-medium">{title}</h3>
      </div>
      <ul className="text-sm text-neutral-600 dark:text-neutral-300 list-disc pl-5 space-y-1">
        {list.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

function buildRecommendations(level, latest) {
  // Baseline guidance
  const base = {
    diet: [
      "Prioritize whole foods: vegetables, legumes, fruits, nuts, and lean proteins.",
      "Aim for 25–35g fiber/day and limit added sugars.",
    ],
    exercise: [
      "Mix cardio (Zone 2) 150–180 min/week with 2–3 strength sessions.",
      "Accumulate 7–8k steps/day minimum.",
    ],
    sleep: [
      "Target 7–9 hours with a consistent sleep/wake schedule.",
      "Keep bedroom cool, dark, and screen-free 60 minutes before bed.",
    ],
    stress: [
      "Practice 5–10 minutes of breathwork or mindfulness daily.",
      "Schedule brief recovery breaks across your day.",
    ],
  };

  const more = {
    high: {
      diet: [
        "Increase omega-3 intake (e.g., 2 servings fatty fish/week or algae oil).",
        "Cap refined carbs; choose low-glycemic options (oats, beans, berries).",
      ],
      exercise: [
        "Add 1 HIIT session/week (e.g., 4x4min) if medically appropriate.",
        "Prioritize progressive overload on compound lifts (squat, hinge, push, pull).",
      ],
      sleep: [
        "Anchor wake time; avoid caffeine after midday; limit alcohol.",
        "Trial magnesium glycinate (consult clinician) and wind-down routine.",
      ],
      stress: [
        "Daily 10–15 min of meditation or yoga; consider nature exposure.",
        "Reduce evening news/social media to lower arousal before sleep.",
      ],
    },
    moderate: {
      diet: ["Dial up protein to ~1.2–1.6 g/kg/day to support body composition."],
      exercise: ["Progressively extend Zone 2 sessions to 45–60 minutes."],
      sleep: ["Maintain a 90-minute wind-down with low light and stretching."],
      stress: ["Use a 2–minute physiological sigh during stressful moments."],
    },
    low: {
      diet: ["Maintain current plan; perform a weekly meal prep to stay consistent."],
      exercise: ["Add mobility work (10 min/day) to support recovery and form."],
      sleep: ["Protect 8 hours in bed; avoid late meals within 3 hours of sleep."],
      stress: ["Try a gratitude journal at night to improve sleep onset."],
    },
    aligned: {
      diet: ["Keep balanced meals; reassess biomarkers every 4–8 weeks."],
      exercise: ["Alternate cardio intensities; respect rest days."],
      sleep: ["Stay consistent; maintain a relaxing pre-sleep ritual."],
      stress: ["Micro-breaks every 90 minutes; quick walks help reset."],
    },
  };

  const pick = more[level] || more.moderate;

  const merged = {
    diet: [...base.diet, ...pick.diet],
    exercise: [...base.exercise, ...pick.exercise],
    sleep: [...base.sleep, ...pick.sleep],
    stress: [...base.stress, ...pick.stress],
  };

  // Optional nudges based on latest labs (simple heuristics)
  if (latest) {
    if (latest.glucose > 100) merged.diet.push("Emphasize post-meal walks (10–15 min) to improve glucose clearance.");
    if (latest.crp > 3) merged.stress.push("Consider anti-inflammatory diet patterns and manage stress load this week.");
    if (latest.wbc > 10) merged.stress.push("Discuss persistent elevated WBC with a clinician to rule out acute issues.");
    if (latest.alkaline_phosphatase > 120) merged.diet.push("Evaluate vitamin D and mineral status with your provider.");
  }

  return merged;
}
