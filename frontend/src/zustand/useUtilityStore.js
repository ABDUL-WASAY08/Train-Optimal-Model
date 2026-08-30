import { create } from "zustand";
import api from "../api/axios";

export const useUtilityStore = create((set) => ({
  loading: false,
  error: null,
  updateAccountDetails: async (updateData) => {
    set({ loading: true, error: null });
    try {
      // Direct call to single route /account/update
      const response = await api.put("/account/update", updateData);
      set({ loading: false });

      return {
        success: true,
        user: response.data.user,
        message: response.data.message,
      };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update account details";
      set({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  clearDetailsError: () => set({ error: null }),
}));