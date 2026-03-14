import { PRESET_COLORS } from "src/utils/helpers.js";

const ColorPicker = ({ color, onChange }) => (
  <div className="flex gap-2 flex-wrap">
    {PRESET_COLORS.map((c) => (
      <button
        key={c}
        onClick={() => onChange(c)}
        className="w-6 h-6 rounded-full border-2 hover:scale-110 transition-transform"
        style={{
          background: c,
          borderColor: c === color ? "#e8e4dc" : "transparent",
        }}
      />
    ))}
  </div>
);
export default ColorPicker;
