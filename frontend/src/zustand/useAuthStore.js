import { create } from 'zustand';
import api from '../api/axios';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  loginWithGithub: () => {
    window.location.href = import.meta.env.VITE_GITHUB_URL;
  },

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/auth/me');
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
        error: err.response?.data?.message || 'Unauthorized',
      });
    }
  },

  // 2. Update Date of Birth Endpoint
  updateDob: async (dob) => {
    try {
      const response = await api.put('/auth/update-dob', { dob });
      set((state) => ({
        user: { ...state.user, dob: response.data.user.dob },
      }));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to update DOB',
      };
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await api.post('/auth/logout');
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
        error: err.response?.data?.message || 'Logout failed',
      };
    }
  },
  clearError: () => set({ error: null }),
}));