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
      const localToday = getLocalToday();
      const updatedData = (data || []).map((item) =>
        item.created_on !== localToday
          ? { ...item, created_on: localToday, count: 0 }
          : item
      );
      const groupedByHabit = Object.values(
        updatedData.reduce((acc, item) => {
          if (!acc[item.habit_id]) {
            acc[item.habit_id] = {
              id: item.habit_id,
              title: item.habit_title,
              hexcode: item.hexcode,
              materials: [],
            };
          }

          const { material_title, material_id, points, count, hexcode } = item;
          if (material_id !== null) {
            acc[item.habit_id].materials.push({
              material_title,
              points,
              material_id,
              count,
              hexcode,
            });
          }
          return acc;
        }, {})
      );
      set({ shuukanData: groupedByHabit, isLoading: false });
    } catch (error) {
      console.warn(error.message);
      set({ error, isLoading: false });
    }
  },

  updateMaterialCount: async (material_id, newCount) => {
    set((state) => ({
      shuukanData: state.shuukanData.map((habit) => ({
        ...habit,
        materials: habit.materials.map((m) =>
          m.material_id === material_id ? { ...m, count: newCount } : m
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

  addHabit: async (title, hexcode) => {
    const id = Math.random().toString().slice(2, 11);
    const newCategory = {
      id,
      title: title,
      hexcode: hexcode,
      materials: [],
    };

    try {
      const { error } = await supabase.from("habit").insert({
        id,
        title: title,
        hexcode: hexcode,
        visible: true,
      });

      if (error) throw error;
    } catch (error) {
      console.warn(error);
    }

    set((state) => ({
      shuukanData: [...(state.shuukanData || []), newCategory],
    }));
  },

  archiveHabit: async (habitId) => {
    set((state) => ({
      shuukanData: state.shuukanData.filter((h) => h.id !== habitId),
    }));

    const { error } = await supabase
      .from("habit")
      .update({ visible: false })
      .eq("id", habitId);
    if (error) {
      console.error(error.message);
      return;
    }
  },

  updateHabitMeta: async (habitId, patch) => {
    // patch can be { title } or { hexcode }
    const { error } = await supabase
      .from("habit")
      .update(patch)
      .eq("id", habitId);
    if (error) {
      console.error(error.message);
      return;
    }
    if (patch.hexcode) {
      // keep materials in sync
      await supabase
        .from("habit_material")
        .update({ hexcode: patch.hexcode })
        .eq("habit_id", habitId);
    }
    set((state) => ({
      shuukanData: state.shuukanData.map((h) =>
        h.id === habitId
          ? {
              ...h,
              ...patch,
              materials: patch.hexcode
                ? h.materials.map((m) => ({ ...m, hexcode: patch.hexcode }))
                : h.materials,
            }
          : h
      ),
    }));
  },

  addMaterial: async (habitId, title, goal) => {
    const habit = get().shuukanData.find((h) => h.id === habitId);
    const id = Math.random().toString().slice(2, 11);
    const newMaterial = {
      material_id: id,
      material_title: title,
      points: goal,
      count: 0,
    };
    const { error } = await supabase.from("habit_material").insert({
      id,
      title: title,
      points: goal,
      habit_id: habitId,
    });
    if (error) {
      console.error(error.message);
      return;
    }
    set((state) => ({
      shuukanData: state.shuukanData.map((h) =>
        h.id === habitId
          ? { ...h, materials: [...h.materials, newMaterial] }
          : h
      ),
    }));
  },

  deleteMaterial: async (habitId, materialId) => {
    set((state) => ({
      shuukanData: state.shuukanData.map((h) =>
        h.id === habitId
          ? {
              ...h,
              materials: h.materials.filter(
                (m) => m.material_id !== materialId
              ),
            }
          : h
      ),
    }));
    const { error } = await supabase
      .from("habit_material")
      .delete()
      .eq("id", materialId);
    if (error) {
      console.error(error.message);
      return;
    }
  },

  updateMaterial: async (habitId, materialId, patch) => {
    // patch can be { material_title } or { points }
    const dbPatch = {};
    if (patch.material_title) dbPatch.title = patch.material_title;
    if (patch.points) dbPatch.points = patch.points;
    const { error } = await supabase
      .from("habit_material")
      .update(dbPatch)
      .eq("id", materialId);
    if (error) {
      console.error(error.message);
      return;
    }
    set((state) => ({
      shuukanData: state.shuukanData.map((h) =>
        h.id === habitId
          ? {
              ...h,
              materials: h.materials.map((m) =>
                m.material_id === materialId ? { ...m, ...patch } : m
              ),
            }
          : h
      ),
    }));
  },
}));
