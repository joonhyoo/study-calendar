import { create } from "zustand";
import supabase from "src/services/supabase";

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  isLoading: true,

  initAuth: async () => {
    // 1️⃣ restore session immediately
    const {
      data: { session },
    } = await supabase.auth.getSession();

    set({
      session,
      user: session?.user ?? null,
      isLoading: false,
    });

    // 2️⃣ listen for OAuth redirect + auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      set({
        session,
        user: session?.user ?? null,
        isLoading: false,
      });

      // handle OAuth redirect
      if (event === "SIGNED_IN") {
        window.location.replace("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  },

  signInWithProvider: async (provider) => {
    return supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));
