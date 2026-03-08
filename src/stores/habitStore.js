import { create } from "zustand";
import supabase from "src/services/supabase";
import { getLocalToday } from "src/utils/helpers";

export const useHabitStore = create((set, get) => ({
  shuukanData: null,
  isLoading: false,
  error: null,

  fetchLatest: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("latest_habit_records")
        .select("*");

      if (error) throw error;

      data.forEach((item) => {
        const localToday = getLocalToday();
        if (item.created_on !== localToday) {
          item.created_on = localToday;
          item.count = 0;
        }
      });

      set({ shuukanData: data, isLoading: false });
    } catch (error) {
      console.warn(error.message);
      set({ error, isLoading: false });
    }
  },

  updateHabit: async (material_id, newCount) => {
    set((state) => ({
      shuukanData: state.shuukanData.map((habit) =>
        habit.material_id === material_id
          ? { ...habit, count: newCount }
          : habit
      ),
    }));
    try {
      const { error } = await supabase.from("habit_records").upsert({
        material_id: material_id,
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
