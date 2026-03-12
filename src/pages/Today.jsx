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
import { useContext, useEffect, useState } from "react";
import { useHabitStore } from "src/stores/habitStore";
import supabase from "src/services/supabase";
import HabitCard from "src/components/HabitCard";

const Today = () => {
  const shuukanData = useHabitStore((state) => state.shuukanData);
  const fetchLatest = useHabitStore((state) => state.fetchLatest);
  const isLoading = useHabitStore((state) => state.updateHabit);

  // Load data on component mount
  useEffect(() => {
    fetchLatest();
  }, [fetchLatest]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const getHabitPosition = (habitId) => {
    return shuukanData.findIndex((habit) => habit.id === habitId);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id === over.id) return;
    const pos1 = getHabitPosition(active.id);
    const pos2 = getHabitPosition(over.id);
    setShuukanData(() => {
      return arrayMove(shuukanData, pos1, pos2);
    });
    // swap the order of these two
    handleSwapOrder(active.id, over.id);
  };

  const handleSwapOrder = async (id1, id2) => {
    // gets original positions
    const original = [
      supabase.from("habit").select("order").eq("id", id1),
      supabase.from("habit").select("order").eq("id", id2),
    ];
    const [{ data: pos1, error: fetchError1 }, { data: pos2, fetchError2 }] =
      await Promise.all(original);

    if (fetchError1) console.warn(fetchError1.message);
    if (fetchError2) console.warn(fetchError2.message);

    // swaps them
    const updates = [
      supabase.from("habit").update({ order: pos2[0].order }).eq("id", id1),
      supabase.from("habit").update({ order: pos1[0].order }).eq("id", id2),
    ];

    const [{ error: updateError1 }, { error: updateError2 }] =
      await Promise.all(updates);

    if (updateError1) console.warn(updateError1.message);
    if (updateError2) console.warn(updateError2.message);
  };
  // temporary
  if (!shuukanData) return <div>Loading...</div>;

  const allMaterials = shuukanData.flatMap((habit) => habit.materials);
  const totalCompleted = allMaterials.reduce((sum, h) => sum + h.count, 0);
  const totalTarget = allMaterials.reduce((sum, h) => sum + h.points, 0);
  const overallPercentage = Math.round((totalCompleted / totalTarget) * 100);

  return (
    <div>
      {/* Progress Overview Card from Figma Make*/}
      <div className="bg-[#323334] rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-300 uppercase tracking-wide font-semibold mb-1">
              Today's Progress
            </p>
            <p className="text-4xl text-left text-gray-200 font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {overallPercentage}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">
              {totalCompleted}/{totalTarget}
            </p>
            <p className="text-sm text-gray-300">tasks completed</p>
          </div>
        </div>
        {/* Overall Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all ease-in-out duration-500 shadow-lg"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-8">
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
              <section
                key={habit.id}
                className="bg-[#2a2b2c] border border-white/5 rounded-2xl p-6 mb-4"
              >
                {/* Section Header */}
                <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-5 flex items-center gap-3">
                  <span
                    className="w-1 h-4 rounded-full"
                    style={{ backgroundColor: habit.hexcode || "#6366f1" }}
                  ></span>
                  {habit.title}
                </h2>

                {/* Habit Cards Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {habit.materials.map((material) => (
                    <HabitCard
                      key={material.material_id}
                      title={material.material_title}
                      id={material.material_id}
                      todayCount={material.count}
                      goal={material.points}
                      hexcode={material.hexcode}
                    />
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
