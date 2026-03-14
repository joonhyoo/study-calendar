import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect } from "react";
import { useHabitStore } from "src/stores/habitStore";
import supabase from "src/services/supabase";
import HabitCard from "src/components/HabitCard";

const Today = () => {
  const shuukanData = useHabitStore((state) => state.shuukanData);
  const fetchLatest = useHabitStore((state) => state.fetchLatest);

  useEffect(() => {
    fetchLatest();
  }, [fetchLatest]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const getHabitPosition = (habitId) =>
    shuukanData.findIndex((habit) => habit.id === habitId);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id === over.id) return;
    const pos1 = getHabitPosition(active.id);
    const pos2 = getHabitPosition(over.id);
    setShuukanData(() => arrayMove(shuukanData, pos1, pos2));
    handleSwapOrder(active.id, over.id);
  };

  const handleSwapOrder = async (id1, id2) => {
    const [{ data: pos1, error: fetchError1 }, { data: pos2, fetchError2 }] =
      await Promise.all([
        supabase.from("habit").select("order").eq("id", id1),
        supabase.from("habit").select("order").eq("id", id2),
      ]);
    if (fetchError1) console.warn(fetchError1.message);
    if (fetchError2) console.warn(fetchError2.message);
    const [{ error: updateError1 }, { error: updateError2 }] =
      await Promise.all([
        supabase.from("habit").update({ order: pos2[0].order }).eq("id", id1),
        supabase.from("habit").update({ order: pos1[0].order }).eq("id", id2),
      ]);
    if (updateError1) console.warn(updateError1.message);
    if (updateError2) console.warn(updateError2.message);
  };

  if (!shuukanData)
    return (
      <div className="min-h-screen bg-[#0e0e0d] flex items-center justify-center">
        <p className="text-[0.65rem] tracking-[0.2em] uppercase text-[#5a5a52]">
          Loading...
        </p>
      </div>
    );

  const allMaterials = shuukanData.flatMap((habit) => habit.materials);
  const totalCompleted = allMaterials.reduce((sum, h) => sum + h.count, 0);
  const totalTarget = allMaterials.reduce((sum, h) => sum + h.points, 0);
  const overallPercentage =
    totalTarget === 0 ? 0 : Math.round((totalCompleted / totalTarget) * 100);

  // Today's date label
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#0e0e0d] py-10 px-6 mx-auto w-full">
      {/* Page header */}
      <div className="mb-10">
        <p className="text-[0.65rem] tracking-[0.2em] uppercase text-[#c8622a] mb-2">
          {today}
        </p>
        <h1 className="font-serif text-4xl tracking-tight text-[#e8e4dc] leading-none">
          Today's <em className="italic text-[#c8622a]">habits.</em>
        </h1>
      </div>

      {/* Progress card */}
      <div className="border border-[#232320] p-6 mb-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-[0.6rem] tracking-[0.18em] uppercase text-gray-400 mb-2">
              Overall Progress
            </p>
            <p className="font-serif text-5xl leading-none text-[#c8622a] italic">
              {overallPercentage}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-[#e8e4dc] text-2xl font-light tracking-tight">
              {totalCompleted}
              <span className="text-[#5a5a52]">/{totalTarget}</span>
            </p>
            <p className="text-[0.65rem] tracking-widest uppercase text-[#5a5a52] mt-1">
              tasks done
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#1a1a18] h-[2px]">
          <div
            className="bg-[#c8622a] h-[2px] transition-all duration-500 ease-in-out"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
      </div>

      {/* Habit sections */}
      <div className="flex flex-col gap-6">
        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <SortableContext
            items={shuukanData.map((habit) => habit.id)}
            strategy={verticalListSortingStrategy}
          >
            {shuukanData.map((habit) => (
              <section key={habit.id} className="border border-[#232320]">
                {/* Section header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-[#232320]">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: habit.hexcode || "#c8622a" }}
                  />
                  <h2 className="text-[0.65rem] tracking-[0.18em] uppercase text-gray-400">
                    {habit.title}
                  </h2>
                </div>

                {/* Cards grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#232320]">
                  {habit.materials.map((material) => (
                    <div key={material.material_id} className="bg-[#0e0e0d]">
                      <HabitCard
                        title={material.material_title}
                        id={material.material_id}
                        todayCount={material.count}
                        goal={material.points}
                        hexcode={material.hexcode}
                      />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default Today;
