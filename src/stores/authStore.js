import { create } from "zustand";
import supabase from "src/services/supabase";

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,

  // Sign in with OAuth provider
  signInWithProvider: async (provider) => {
    set({ isLoading: true });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/home`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (!error && data?.user) {
      set({ user: data.user });
    }

    set({ isLoading: false });
    return { error, user: data?.user ?? null };
  },

  verifyUser: async () => {
    set({ isLoading: true });

    // Get the current session
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError || !sessionData?.session) {
      set({ user: null, isLoading: false });
      return null;
    }

    // Set the user from session
    const user = sessionData.session.user;
    set({ user });

    set({ isLoading: false });
    return user;
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
