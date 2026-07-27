import apiClient from "./axios";
import type { AuthResponse, AuthUser, LoginDto } from "@/types";
import { API_ENDPOINTS } from "@/constants";

// NOTE: unlike every other module in this API, /auth/* endpoints return
// their payload directly (no {success,message,data} envelope) — so no
// unwrap() here is intentional, not an oversight.
export const authService = {
  async login(dto: LoginDto): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH_LOGIN, dto);
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
    }
    return data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH_LOGOUT);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }
  },

  async refresh(): Promise<{ accessToken: string }> {
    const refreshToken =
      typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
    const { data } = await apiClient.post<{ accessToken: string }>(API_ENDPOINTS.AUTH_REFRESH, {
      refreshToken,
    });
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", data.accessToken);
    }
    return data;
  },

  async getMe(): Promise<AuthUser> {
    const { data } = await apiClient.get<AuthUser>(API_ENDPOINTS.AUTH_ME);
    return data;
  },

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("accessToken");
  },
};
