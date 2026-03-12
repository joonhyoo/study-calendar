import { useState } from "react";
import { HabitRing } from "./HabitRing";
import { useHabitStore } from "src/stores/habitStore";

function HabitCard({ title, id, hexcode, todayCount, goal }) {
  const [isHovering, setIsHovering] = useState(false);
  const done = todayCount >= goal;
  const updateHabit = useHabitStore((state) => state.updateHabit);

  return (
    <div className="bg-[#323334] rounded-2xl flex flex-col gap-2 sm:gap-4 items-center px-4 py-4 sm:py-8">
      {/* Ring + overlay */}
      <div className="relative">
        <div className="hidden sm:block">
          <HabitRing
            count={todayCount}
            goal={goal}
            color={hexcode}
            size={140}
            stroke={12}
            previewCount={isHovering && !done ? todayCount + 1 : todayCount}
          />
        </div>
        <div className="block sm:absolute inset-0 flex sm:flex-col items-center justify-center gap-1 sm:gap-0">
          <span
            className="text-4xl font-semibold ease-in-out duration-250"
            style={{
              color: done ? hexcode : "#fff",
              opacity: isHovering ? 0.45 : 1,
              transition: "opacity 0.2s ease",
            }}
          >
            {isHovering && !done ? todayCount + 1 : todayCount}
          </span>
          <span
            className="text-xs text-white opacity-35 tracking-wider"
            style={{
              opacity: isHovering ? 0.5 : 1,
              transition: "opacity 0.2s ease",
            }}
          >
            / {goal}
          </span>
        </div>
      </div>

      {/* Title */}
      <h4 className="text-lg sm:text-xl font-bold">{title}</h4>

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
          className="rounded-xl py-2 text-md font-semibold tracking-wider ease duration-250 w-full hover:opacity-70"
          style={{
            background: done ? `${hexcode}22` : hexcode,
            color: done ? hexcode : "#000",
            cursor: done ? "default" : "pointer",
          }}
        >
          {done ? "Done!" : "Log +1"}
        </button>
      </div>
    </div>
  );
}

export default HabitCard;
