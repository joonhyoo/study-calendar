import { useEffect, useState } from "react";
import ReorderButtons from "src/components/ReorderButtons";
import HabitBlock from "src/components/HabitBlock";
import AddHabitForm from "src/components/AddHabitForm";
import { useHabitStore } from "src/stores/habitStore";
import { PRESET_COLORS } from "src/utils/helpers.js";

// ── Page ──────────────────────────────────────────────────────────────────────
function HabitSettings() {
  const shuukanData = useHabitStore((s) => s.shuukanData);
  const fetchLatest = useHabitStore((s) => s.fetchLatest);
  const [addingHabit, setAddingHabit] = useState(false);

  useEffect(() => {
    fetchLatest();
  }, [fetchLatest]);

  const sorted = [...(shuukanData || [])].sort((a, b) => a.order - b.order);

  if (!shuukanData)
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[0.65rem] tracking-[0.2em] uppercase text-[#5a5a52]">
          Loading...
        </p>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <div className="mb-10">
        <p className="text-[0.65rem] tracking-[0.2em] uppercase text-[#c8622a] mb-2">
          Manage
        </p>
        <h1 className="font-serif text-4xl tracking-tight text-[#e8e4dc] leading-none">
          Your <em className="italic text-[#c8622a]">habits.</em>
        </h1>
        <p className="text-xs text-neutral-500 tracking-wide mt-2">
          Add new categories, habits, or click edit to make changes.
        </p>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        {sorted.map((habit, i) => (
          <HabitBlock
            key={habit.id}
            habit={habit}
            isFirst={i === 0}
            isLast={i === sorted.length - 1}
          />
        ))}
      </div>

      {addingHabit ? (
        <AddHabitForm onClose={() => setAddingHabit(false)} />
      ) : (
        <button
          onClick={() => setAddingHabit(true)}
          className="w-full py-3 border border-dashed border-[#232320] text-[0.65rem] tracking-[0.18em] uppercase text-[#5a5a52] hover:border-[#c8622a] hover:text-[#c8622a] transition-all"
        >
          + add category
        </button>
      )}
    </div>
  );
}

export default HabitSettings;
