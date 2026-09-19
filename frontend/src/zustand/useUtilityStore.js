import { create } from "zustand";
import api from "../api/axios";

export const useUtilityStore = create((set) => ({
  loading: false,
  error: null,
  url: "",
  updateAccountDetails: async (updateData) => {
    set({ loading: true, error: null });
    try {
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
  getPortfolioUrl: async () => {
    set({ loading: true, error: null });

    try {
      const response = await api.get("/user/getprofile");

      set({ loading: false });

      return {
        success: true,
        url: response.data.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to get portfolio URL";

      set({
        loading: false,
        error: errorMessage,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  },
  clearDetailsError: () => set({ error: null }),
}));
