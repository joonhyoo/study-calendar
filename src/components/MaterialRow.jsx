import { useHabitStore } from "src/stores/habitStore";
import { useState } from "react";
import Stepper from "src/components/Stepper";

// ── Delete modal ──────────────────────────────────────────────────────────────
const DeleteModal = ({ materialTitle, onConfirm, onCancel }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center px-4"
    onClick={onCancel}
  >
    <div className="absolute inset-0 bg-[#0e0e0d]/80 backdrop-blur-sm" />
    <div
      className="relative w-full max-w-sm border border-[#232320] bg-[#0e0e0d] p-6 flex flex-col gap-5"
      onClick={(e) => e.stopPropagation()}
    >
      <div>
        <p className="text-[0.6rem] tracking-[0.2em] uppercase text-red-500 mb-3">
          Destructive action
        </p>
        <h2 className="font-serif text-2xl text-[#e8e4dc] leading-snug mb-2">
          Delete <em className="italic text-[#c8622a]">{materialTitle}?</em>
        </h2>
        <p className="text-[0.75rem] leading-relaxed text-[#5a5a52]">
          This will permanently delete this habit and all its records. This
          action cannot be undone.
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 text-[0.65rem] tracking-[0.18em] uppercase border border-red-900 text-red-500 hover:bg-red-950/40 transition-colors"
        >
          Yes, delete
        </button>
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 text-[0.65rem] tracking-[0.18em] uppercase border border-[#232320] text-[#5a5a52] hover:text-[#e8e4dc] hover:border-[#5a5a52] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

// ── Material row ──────────────────────────────────────────────────────────────
const MaterialRow = ({ material, habitId, isFirst, isLast }) => {
  const updateMaterial = useHabitStore((s) => s.updateMaterial);
  const deleteMaterial = useHabitStore((s) => s.deleteMaterial);
  const reorderMaterial = useHabitStore((s) => s.reorderMaterial);

  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
    <>
      {confirming && (
        <DeleteModal
          materialTitle={material.material_title}
          onConfirm={() => {
            deleteMaterial(habitId, material.material_id);
            setConfirming(false);
          }}
          onCancel={() => setConfirming(false)}
        />
      )}

      <div className="border-b border-neutral-800 py-3 flex items-center gap-3 group">
        <span className="flex-1 text-[0.78rem] tracking-wide text-[#5a5a52] truncate text-left">
          {material.material_title}
        </span>

        <span className="text-[0.65rem] tracking-widest text-[#3a3a38] flex-shrink-0">
          Goal: <span className="text-[#5a5a52]">{material.points}</span>
        </span>

        {/* Desktop buttons */}
        <div className="hidden sm:flex gap-2 flex-shrink-0">
          <button
            onClick={() => setEditing(true)}
            className="text-[0.6rem] tracking-[0.15em] uppercase px-2 py-1 border border-[#232320] text-[#5a5a52] hover:border-[#5a5a52] hover:text-[#e8e4dc] transition-colors"
          >
            edit
          </button>
          <button
            onClick={() => setConfirming(true)}
            className="text-[0.6rem] tracking-[0.15em] uppercase px-2 py-1 border border-red-900 text-red-800 hover:border-red-600 hover:text-red-500 transition-colors"
          >
            delete
          </button>
        </div>

        {/* Mobile: kebab menu */}
        <div className="relative sm:hidden flex-shrink-0">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="text-[#5a5a52] hover:text-[#e8e4dc] transition-colors px-2 py-1 text-base leading-none"
          >
            ···
          </button>
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-8 z-20 bg-[#0e0e0d] border border-[#232320] flex flex-col min-w-[100px] shadow-xl">
                <button
                  onClick={() => {
                    setEditing(true);
                    setMenuOpen(false);
                  }}
                  className="px-4 py-2.5 text-left text-[0.65rem] tracking-[0.15em] uppercase text-[#5a5a52] hover:text-[#e8e4dc] hover:bg-[#161614] transition-colors border-b border-[#232320]"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setConfirming(true);
                    setMenuOpen(false);
                  }}
                  className="px-4 py-2.5 text-left text-[0.65rem] tracking-[0.15em] uppercase text-red-800 hover:text-red-500 hover:bg-[#161614] transition-colors"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MaterialRow;
