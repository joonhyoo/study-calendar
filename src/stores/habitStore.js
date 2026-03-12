import { create } from "zustand";
import supabase from "src/services/supabase";
import { getLocalToday } from "src/utils/helpers";

export const useHabitStore = create((set, get) => ({
  shuukanData: null,
  isLoading: false,
  error: null,

  // Fetch latest habits
  fetchLatest: async () => {
    set({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase
        .from("latest_habit_records")
        .select("*");

      if (error) throw error;

      const localToday = getLocalToday();

      // Reset count for items not from today
      const updatedData = (data || []).map((item) =>
        item.created_on !== localToday
          ? { ...item, created_on: localToday, count: 0 }
          : item
      );

      // Group by habit_id
      const groupedByHabit = Object.values(
        updatedData.reduce((acc, item) => {
          if (!acc[item.habit_id]) {
            acc[item.habit_id] = {
              id: item.habit_id,
              order: item.habit_order,
              title: item.habit_title,
              hexcode: item.hexcode,
              materials: [],
            };
          }
          acc[item.habit_id].materials.push(item);
          return acc;
        }, {})
      );

      set({ shuukanData: groupedByHabit, isLoading: false });
    } catch (error) {
      console.warn(error.message);
      set({ error, isLoading: false });
    }
  },

  // Update habit count
  updateHabit: async (material_id, newCount) => {
    // 1️⃣ Update local state immediately (fast)
    set((state) => ({
      shuukanData: state.shuukanData.map((habit) => ({
        ...habit,
        materials: habit.materials.map((material) =>
          material.material_id === material_id
            ? { ...material, count: newCount }
            : material
        ),
      })),
    }));

    try {
      const { error } = await supabase.from("habit_records").upsert({
        material_id,
        created_on: getLocalToday(),
        count: newCount,
      });
      if (error) throw error;
    } catch (error) {
      console.warn(error.message);
      set({ error });
    }
  },
}));
