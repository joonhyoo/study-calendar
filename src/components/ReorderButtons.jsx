const ReorderButtons = ({ onUp, onDown, disableUp, disableDown }) => (
  <div className="flex flex-col gap-1">
    <button
      onClick={onUp}
      disabled={disableUp}
      className={`text-[#5a5a52] hover:text-[#e8e4dc] transition-colors text-[0.75rem] leading-none px-1 ${disableUp ? "opacity-20 cursor-default" : ""}`}
    >
      ▲
    </button>
    <button
      onClick={onDown}
      disabled={disableDown}
      className={`text-[#5a5a52] hover:text-[#e8e4dc] transition-colors text-[0.75rem] leading-none px-1 ${disableDown ? "opacity-20 cursor-default" : ""}`}
    >
      ▼
    </button>
  </div>
);
export default ReorderButtons;
