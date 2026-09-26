import { create } from "zustand";
import api from "../api/axios";

export const useUtilityStore = create((set) => ({
  loading: false,
  error: null,
  url: "",

  // account details update
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
  // this is to get profile url this will give us url from backend 
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

  // ---------------- certificates ----------------
  certificates: [],
  certificatesLoading: false,
  certificateError: null,

  // upload a single certificate image + its metadata
  // expects: { image: File, certificateName, companyName, role, description, issueDate }
  uploadCertificates: async (certificate) => {
    set({ certificatesLoading: true, certificateError: null });

    try {
      const formData = new FormData();
      formData.append("image", certificate.image);
      formData.append("certificateName", certificate.certificateName || "");
      formData.append("companyName", certificate.companyName || "");
      formData.append("role", certificate.role || "");
      formData.append("description", certificate.description || "");
      formData.append("issueDate", certificate.issueDate || "");

      const response = await api.post("/user/upload", formData);

      set((state) => ({
        certificates: [response.data.data, ...state.certificates],
        certificatesLoading: false,
      }));

      return {
        success: true,
        certificate: response.data.data,
        message: response.data.message,
      };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to upload certificate";
      set({ certificatesLoading: false, certificateError: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // get every certificate belonging to the logged in user
  getCertificates: async () => {
    set({ certificatesLoading: true, certificateError: null });

    try {
      const response = await api.get("/user/");

      set({ certificates: response.data.data || [], certificatesLoading: false });

      return { success: true, certificates: response.data.data || [] };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch certificates";
      set({ certificatesLoading: false, certificateError: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // delete a certificate by id (also removes it from cloudinary)
  deleteCertificates: async (certificateId) => {
    set({ certificatesLoading: true, certificateError: null });

    try {
      const response = await api.delete(`/user/${certificateId}`);

      set((state) => ({
        certificates: state.certificates.filter(
          (item) => item._id !== certificateId
        ),
        certificatesLoading: false,
      }));

      return {
        success: true,
        message: response.data.message,
      };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete certificate";
      set({ certificatesLoading: false, certificateError: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  clearCertificatesError: () => set({ certificateError: null }),
}));
