import { useState } from "react";
import { HabitRing } from "./HabitRing";
import { useHabitStore } from "src/stores/habitStore";

function HabitCard({ title, id, hexcode, todayCount, goal }) {
  const [isHovering, setIsHovering] = useState(false);
  const done = todayCount >= goal;
  const updateHabit = useHabitStore((state) => state.updateHabit);

  return (
    <div className="bg-[#323334] rounded-2xl flex flex-col gap-[16px] items-center px-4 py-8">
      {/* Ring + overlay */}
      <div className="relative">
        <HabitRing
          count={todayCount}
          goal={goal}
          color={hexcode}
          size={140}
          stroke={12}
          previewCount={isHovering && !done ? todayCount + 1 : todayCount}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-[600] ease-in-out duration-250"
            style={{
              color: done ? hexcode : "#fff",
              opacity: isHovering ? 0.45 : 1,
              transition: "opacity 0.2s ease",
            }}
          >
            {isHovering && !done ? todayCount + 1 : todayCount}
          </span>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 13,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.05em",
              opacity: isHovering ? 0.5 : 1,
              transition: "opacity 0.2s ease",
            }}
          >
            / {goal}
          </span>
        </div>
      </div>

      {/* Title */}
      <h4 className="text-[20px] font-[700]">{title}</h4>

      {/* Button with hover preview using arrow functions */}
      <div className="flex flex-col justify-center w-full">
        <button
          onClick={() => !done && updateHabit(id, todayCount + 1)}
          onMouseEnter={() => {
            if (!done) {
              setIsHovering(true);
            }
          }}
          onMouseLeave={() => setIsHovering(false)}
          type="button"
          disabled={done}
          className="rounded-xl px-7 py-3 text-md font-[700] tracking-wider ease duration-250 w-full"
          style={{
            background: done ? `${hexcode}22` : hexcode,
            color: done ? hexcode : "#000",
            cursor: done ? "default" : "pointer",
            opacity: done ? 0.6 : 1,
          }}
        >
          {done ? "Done!" : "Log +1"}
        </button>
      </div>
    </div>
  );
}

export default HabitCard;
