const Stepper = ({ value, onChange, min = 1 }) => (
  <div className="flex items-center border border-[#232320] w-28">
    <button
      onClick={() => onChange(Math.max(min, value - 1))}
      className="px-3 py-1.5 text-gray-600 hover:text-gray-200 hover:bg-[#161614] transition-colors text-sm border-r border-[#232320] select-none"
    >
      −
    </button>
    <span className="flex-1 text-center text-[0.8rem] text-gray-300 tabular-nums">
      {value}
    </span>
    <button
      onClick={() => onChange(value + 1)}
      className="px-3 py-1.5 text-[#5a5a52] hover:text-[#e8e4dc] hover:bg-[#161614] transition-colors text-sm border-l border-[#232320] select-none"
    >
      +
    </button>
  </div>
);
export default Stepper;
