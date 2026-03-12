// HabitCard.jsx
import { useState } from "react";
import { HabitRing } from "./HabitRing";
import { useHabitStore } from "src/stores/habitStore";

function HabitCard({ title, id, hexcode, todayCount, goal }) {
  const [isHovering, setIsHovering] = useState(false);
  const done = todayCount >= goal;
  const updateHabit = useHabitStore((state) => state.updateHabit);

  return (
    <div className="flex flex-col items-center gap-4 px-5 py-7 bg-[#0e0e0d]">
      {/* Ring */}
      <div className="relative hidden sm:block">
        <HabitRing
          count={todayCount}
          goal={goal}
          color={hexcode}
          size={120}
          stroke={10}
          previewCount={isHovering && !done ? todayCount + 1 : todayCount}
        />
        {/* Count overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-light transition-opacity duration-200"
            style={{
              color: done ? hexcode : "#e8e4dc",
              opacity: isHovering ? 0.4 : 1,
            }}
          >
            {isHovering && !done ? todayCount + 1 : todayCount}
          </span>
          <span className="text-[0.6rem] tracking-widest text-[#5a5a52]">
            / {goal}
          </span>
        </div>
      </div>

      {/* Mobile count (no ring) */}
      <div className="flex items-baseline gap-1 sm:hidden">
        <span
          className="text-3xl font-light"
          style={{ color: done ? hexcode : "#e8e4dc" }}
        >
          {todayCount}
        </span>
        <span className="text-sm tracking-widest text-[#5a5a52]">/ {goal}</span>
      </div>

      {/* Title */}
      <p className="text-xs tracking-[0.12em] uppercase text-[#5a5a52] text-center">
        {title}
      </p>

      {/* Log button */}
      <button
        type="button"
        disabled={done}
        onClick={() => !done && updateHabit(id, todayCount + 1)}
        onMouseEnter={() => !done && setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="w-full py-2 text-[0.65rem] tracking-[0.18em] uppercase transition-all duration-200 border"
        style={{
          borderColor: done ? `${hexcode}33` : hexcode,
          color: done ? hexcode : "#0e0e0d",
          background: done ? "transparent" : hexcode,
          cursor: done ? "default" : "pointer",
          opacity: isHovering && !done ? 0.75 : 1,
        }}
      >
        {done ? "Done" : "Log +1"}
      </button>
    </div>
  );
}

export default HabitCard;
