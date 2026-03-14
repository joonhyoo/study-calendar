import { useState } from "react";
import ColorPicker from "src/components/ColorPicker";
import { useHabitStore } from "src/stores/habitStore";

const AddHabitForm = ({ onClose }) => {
  const addHabit = useHabitStore((s) => s.addHabit);
  const [title, setTitle] = useState("");
  const [hexcode, setHexcode] = useState("#c8622a");

  const handleSubmit = async () => {
    if (!title.trim()) return;
    await addHabit(title.trim(), hexcode);
    onClose();
  };

  return (
    <div
      className="border p-5 flex flex-col gap-4"
      style={{ borderColor: hexcode + "4D" }}
    >
      <p
        className="text-sm tracking-[0.2em] uppercase"
        style={{ color: hexcode }}
      >
        New Category
      </p>
      <div className="flex flex-col gap-1">
        <label className="text-xs tracking-[0.18em] uppercase text-[#5a5a52]">
          Category Name
        </label>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
            if (e.key === "Escape") onClose();
          }}
          placeholder="e.g., Language Study"
          className="bg-transparent border border-neutral-800 focus:border-neutral-700 outline-none text-neutral-300 text-sm px-3 py-2 placeholder:text-neutral-600 transition-colors"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs tracking-[0.18em] uppercase text-[#5a5a52]">
          Color
        </label>
        <ColorPicker color={hexcode} onChange={setHexcode} />
        <div className="flex items-center gap-2 mt-1">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: hexcode }}
          />
          <span className="text-[0.65rem] tracking-[0.18em] uppercase text-[#5a5a52]">
            {title || "Category preview"}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="flex-1 py-2.5 text-[#0e0e0d] text-[0.65rem] tracking-[0.18em] uppercase hover:opacity-80 transition-opacity"
          style={{ backgroundColor: hexcode }}
        >
          + Add Category
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2.5 border border-[#232320] text-[#5a5a52] text-[0.65rem] tracking-[0.18em] uppercase hover:text-[#e8e4dc] hover:border-[#5a5a52] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
export default AddHabitForm;
