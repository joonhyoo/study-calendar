import { useHabitStore } from "src/stores/habitStore";
import { useEffect, useState } from "react";
import Stepper from "src/components/Stepper";

const MaterialRow = ({ material, habitId, isFirst, isLast }) => {
  const updateMaterial = useHabitStore((s) => s.updateMaterial);
  const deleteMaterial = useHabitStore((s) => s.deleteMaterial);
  const reorderMaterial = useHabitStore((s) => s.reorderMaterial);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(material.material_title);
  const [goal, setGoal] = useState(material.points);

  const handleSave = () => {
    if (name.trim() && name !== material.material_title)
      updateMaterial(habitId, material.material_id, {
        material_title: name.trim(),
      });
    if (goal !== material.points)
      updateMaterial(habitId, material.material_id, { points: goal });
    setEditing(false);
  };

  const handleCancel = () => {
    setName(material.material_title);
    setGoal(material.points);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="py-3 flex border-b border-neutral-800 flex-col sm:flex-row gap-4">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleCancel();
          }}
          className="flex-1 bg-transparent border-b border-[#c8622a] outline-none text-[#e8e4dc] text-[0.78rem] tracking-wide py-0.5"
        />

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[0.6rem] tracking-widest uppercase text-[#5a5a52]">
            Goal
          </span>
          <Stepper value={goal} onChange={setGoal} />
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleSave}
            className="text-[0.6rem] tracking-[0.15em] uppercase px-2 py-1 bg-[#c8622a] text-[#0e0e0d] hover:opacity-80 transition-opacity"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="text-[0.6rem] tracking-[0.15em] uppercase px-2 py-1 border border-[#232320] text-[#5a5a52] hover:text-[#e8e4dc] hover:border-[#5a5a52] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-neutral-800 py-3 flex items-center gap-4 group text-left">
      <span className="flex-1 text-[0.78rem] tracking-wide text-[#5a5a52]">
        {material.material_title}
      </span>

      <span className="text-[0.65rem] tracking-widest text-[#3a3a38]">
        Goal: <span className="text-[#5a5a52]">{material.points}</span>
      </span>

      <button
        onClick={() => setEditing(true)}
        className="text-[0.6rem] tracking-[0.15em] uppercase px-2 py-1 border border-[#232320] text-[#5a5a52] hover:border-[#5a5a52] hover:text-[#e8e4dc] transition-colors"
      >
        edit
      </button>
    </div>
  );
};

export default MaterialRow;
