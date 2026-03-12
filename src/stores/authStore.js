import { create } from "zustand";
import supabase from "src/services/supabase";

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: true, // start true — we don't know yet

  // Call once on app mount. Resolves the initial session AND listens for
  // the SIGNED_IN event that fires when Chrome restores the OAuth redirect.
  initAuth: () => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      set({ user: session?.user ?? null, isLoading: false });
    });
    return () => subscription.unsubscribe(); // return cleanup for useEffect
  },

  signInWithProvider: async (provider) => {
    set({ isLoading: true });
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/home`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    if (error) set({ isLoading: false });
    return { error, user: data?.user ?? null };
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out:", error.message);
    } finally {
      set({ user: null, isLoading: false });
    }
  },
}));
