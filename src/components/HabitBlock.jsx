import { useState } from "react";
import MaterialRow from "src/components/MaterialRow";
import AddMaterialForm from "src/components/AddMaterialForm";
import { useHabitStore } from "src/stores/habitStore";
import { PRESET_COLORS } from "src/utils/helpers.js";

// ── Delete modal ──────────────────────────────────────────────────────────────
const DeleteModal = ({ habitTitle, materials = [], onConfirm, onCancel }) => {
  const visible = materials.slice(0, 3);
  const overflow = materials.length - visible.length;

  return (
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
            Delete <em className="italic text-[#c8622a]">{habitTitle}?</em>
          </h2>
          <p className="text-[0.75rem] leading-relaxed text-[#5a5a52]">
            This will permanently delete all related habits and records. This
            action cannot be undone.
          </p>
        </div>
        {materials.length > 0 && (
          <div className="border border-[#232320]">
            <p className="text-[0.58rem] tracking-[0.18em] uppercase text-[#3a3a38] px-3 py-2 border-b border-[#232320]">
              Will be deleted
            </p>
            {visible.map((m) => (
              <div
                key={m.material_id}
                className="flex items-center justify-between px-3 py-2 border-b border-[#232320] last:border-b-0"
              >
                <span className="text-[0.72rem] text-[#5a5a52] tracking-wide">
                  {m.material_title}
                </span>
                <span className="text-[0.58rem] tracking-widest text-[#3a3a38]">
                  goal: {m.points}
                </span>
              </div>
            ))}
            {overflow > 0 && (
              <div className="px-3 py-2 text-[0.62rem] tracking-widest uppercase text-[#3a3a38]">
                + {overflow} more
              </div>
            )}
          </div>
        )}
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
};

// ── Habit block ───────────────────────────────────────────────────────────────
const HabitBlock = ({ habit, isFirst, isLast }) => {
  const [addingMaterial, setAddingMaterial] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState(habit.title);
  const [draftColor, setDraftColor] = useState(habit.hexcode || "#c8622a");

  const updateHabitMeta = useHabitStore((s) => s.updateHabitMeta);
  const reorderHabit = useHabitStore((s) => s.reorderHabit);
  const deleteHabit = useHabitStore((s) => s.deleteHabit);

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
    <div className="flex flex-col gap-3 px-4 py-4 border-b border-[#232320]">
      <input
        autoFocus
        value={draftTitle}
        onChange={(e) => setDraftTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") handleCancel();
        }}
        className="w-full bg-transparent border-b outline-none text-neutral-300 text-xs tracking-widest uppercase py-0.5"
        style={{ borderColor: draftColor }}
      />

      {/* Color swatches */}
      <div className="flex gap-2 flex-wrap">
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setDraftColor(c)}
            className="w-5 h-5 rounded-full border-2 hover:scale-110 transition-transform"
            style={{
              background: c,
              borderColor: c === draftColor ? "#e8e4dc" : "transparent",
            }}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 py-2 text-[0.6rem] tracking-[0.15em] uppercase bg-[#c8622a] text-[#0e0e0d] hover:opacity-80 transition-opacity"
        >
          Save
        </button>
        <button
          onClick={handleCancel}
          className="flex-1 py-2 text-[0.6rem] tracking-[0.15em] uppercase border border-[#232320] text-[#5a5a52] hover:text-[#e8e4dc] hover:border-[#5a5a52] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-2 px-4 py-4 border-b border-[#232320]">
      {/* Color dot + title */}
      <span
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ background: habit.hexcode || "#c8622a" }}
      />
      <span className="flex-1 text-xs text-left tracking-widest uppercase text-neutral-400 truncate">
        {habit.title}
      </span>
      <span className="text-[0.6rem] tracking-widest text-[#3a3a38] flex-shrink-0 hidden sm:block">
        {habit.materials.length} habit{habit.materials.length !== 1 ? "s" : ""}
      </span>

      {/* Desktop buttons */}
      <div className="hidden sm:flex gap-2">
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
      <div className="relative sm:hidden">
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
  );

  return (
    <>
      {confirming && (
        <DeleteModal
          habitTitle={habit.title}
          materials={habit.materials}
          onConfirm={() => {
            deleteHabit(habit.id);
            setConfirming(false);
          }}
          onCancel={() => setConfirming(false)}
        />
      )}

      <div className="border border-[#232320]">
        {header}
        <div className="px-4 pb-4">
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
    </>
  );
};

export default HabitBlock;
