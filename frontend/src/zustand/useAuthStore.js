import { create } from "zustand";
import api from "../api/axios";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,

  loginWithGithub: (role = "developer") => {
    const githubUrl = new URL(import.meta.env.VITE_GITHUB_URL || "http://localhost:5000/api/auth/github");
    githubUrl.searchParams.set("role", role);
    window.location.href = githubUrl.toString();
  },

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/auth/me");
      set({
        user: response.data.user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err) {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: err.response?.data?.message || "Unauthorized",
      });
    }
  },
  setUser: (userData) =>
    set((state) => ({ user: { ...state.user, ...userData } })),
  // 2. Update Date of Birth Endpoint
  updateDob: async (dob) => {
    try {
      const response = await api.put("/auth/update-dob", { dob });
      set((state) => ({
        user: { ...state.user, dob: response.data.user.dob },
      }));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to update DOB",
      };
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await api.post("/auth/logout");
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });

      return { success: true };
    } catch (err) {
      set({ loading: false });
      return {
        success: false,
        error: err.response?.data?.message || "Logout failed",
      };
    }
  },
  clearError: () => set({ error: null }),
}));
