import { useEffect, useState } from "react";
import { useHabitStore } from "src/stores/habitStore";
import Stepper from "src/components/Stepper";

const AddMaterialForm = ({ habitId, onClose }) => {
  const addMaterial = useHabitStore((s) => s.addMaterial);
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState(1);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    await addMaterial(habitId, title.trim(), goal);
    onClose();
  };

  return (
    <div className="mt-3 border border-[#232320] bg-[#0e0e0d] p-4 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs tracking-widest uppercase text-[#5a5a52]">
          Habit Name
        </label>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
            if (e.key === "Escape") onClose();
          }}
          placeholder="e.g., Morning meditation"
          className="bg-transparent border border-[#232320] focus:border-[#c8622a] outline-none text-[#e8e4dc] text-xs px-3 py-2 placeholder:text-[#3a3a38] transition-colors"
        />
      </div>
      <div className="flex flex-col gap-2 items-center">
        <label className="text-xs tracking-widest uppercase text-[#5a5a52]">
          Daily Goal
        </label>
        <Stepper value={goal} onChange={setGoal} />
        <p className="text-xs text-neutral-700">
          How many times per day do you want to complete this habit?
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="flex-1 py-2.5 bg-[#c8622a] text-[#0e0e0d] text-xs tracking-widest uppercase hover:opacity-80 transition-opacity"
        >
          + Add Habit
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2.5 border border-[#232320] text-[#5a5a52] text-xs tracking-widest uppercase hover:text-[#e8e4dc] hover:border-[#5a5a52] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddMaterialForm;
