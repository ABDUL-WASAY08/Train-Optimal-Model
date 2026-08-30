import { create } from 'zustand';
import api from '../api/axios';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  loginWithGithub: () => {
    window.location.href = 'http://localhost:5000/api/auth/github';
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

  // 3. Clear Error State
  clearError: () => set({ error: null }),
}));