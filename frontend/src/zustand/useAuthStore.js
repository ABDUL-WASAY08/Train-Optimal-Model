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

  // 2. Fetch Logged-in User Profile (/api/auth/me)
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

  // 3. Clear Error State
  clearError: () => set({ error: null }),
}));