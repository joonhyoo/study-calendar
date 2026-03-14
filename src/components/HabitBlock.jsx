import { useState } from "react";
import MaterialRow from "src/components/MaterialRow";
import AddMaterialForm from "src/components/AddMaterialForm";
import { useHabitStore } from "src/stores/habitStore";
import { PRESET_COLORS } from "src/utils/helpers.js";

const HabitBlock = ({ habit, isFirst, isLast }) => {
  const [addingMaterial, setAddingMaterial] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(habit.title);
  const [draftColor, setDraftColor] = useState(habit.hexcode || "#c8622a");

  const archiveHabit = useHabitStore((s) => s.archiveHabit);
  const updateHabitMeta = useHabitStore((s) => s.updateHabitMeta);
  const reorderHabit = useHabitStore((s) => s.reorderHabit);

  const handleSave = () => {
    const patch = {};
    if (draftTitle.trim() && draftTitle !== habit.title)
      patch.title = draftTitle.trim();
    if (draftColor !== habit.hexcode) patch.hexcode = draftColor;
    if (Object.keys(patch).length) updateHabitMeta(habit.id, patch);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraftTitle(habit.title);
    setDraftColor(habit.hexcode || "#c8622a");
    setEditing(false);
  };

  const sorted = [...habit.materials].sort(
    (a, b) => a.material_order - b.material_order
  );

  const header = editing ? (
    // ── Edit mode header ──
    <div className="flex flex-col sm:flex-row gap-3 px-5 py-4 border-b border-[#232320]">
      <input
        autoFocus
        value={draftTitle}
        onChange={(e) => setDraftTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") handleCancel();
        }}
        className="flex-1 bg-transparent border-b outline-none text-neutral-300 text-xs tracking-widest uppercase py-0.5"
        style={{ borderColor: draftColor }}
      />

      {/* Inline color swatches */}
      <div className="flex gap-1.5 flex-shrink-0">
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setDraftColor(c)}
            className="w-4 h-4 rounded-full border hover:scale-110 transition-transform"
            style={{
              background: c,
              borderColor: c === draftColor ? "#e8e4dc" : "transparent",
            }}
          />
        ))}
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
  ) : (
    // ── View mode header ──
    <div className="flex items-center gap-3 px-5 py-4 border-b border-[#232320]">
      <span
        className="w-3 h-3 rounded-full flex-shrink-0"
        style={{ background: habit.hexcode || "#c8622a" }}
      />

      <span className="flex-1 text-xs tracking-widest uppercase text-neutral-400 text-left">
        {habit.title}
      </span>

      <span className="text-[0.6rem] tracking-widest text-[#3a3a38]">
        {habit.materials.length} habit{habit.materials.length !== 1 ? "s" : ""}
      </span>

      <button
        onClick={() => setEditing(true)}
        className="text-[0.6rem] tracking-[0.15em] uppercase px-2 py-1 border border-[#232320] text-[#5a5a52] hover:border-[#5a5a52] hover:text-[#e8e4dc] transition-colors"
      >
        edit
      </button>
    </div>
  );

  return (
    <div className="border border-[#232320]">
      {header}

      <div className="px-5 pb-4">
        {sorted.map((m, i) => (
          <MaterialRow
            key={m.material_id}
            material={m}
            habitId={habit.id}
            isFirst={i === 0}
            isLast={i === sorted.length - 1}
          />
        ))}
        {addingMaterial ? (
          <AddMaterialForm
            habitId={habit.id}
            onClose={() => setAddingMaterial(false)}
          />
        ) : (
          <button
            onClick={() => setAddingMaterial(true)}
            className="mt-4 text-xs tracking-widest uppercase text-[#5a5a52] hover:text-[#c8622a] transition-colors"
          >
            + add habit
          </button>
        )}
      </div>
    </div>
  );
};
export default HabitBlock;
