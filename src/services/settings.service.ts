import apiClient, { unwrap } from "./axios";
import type { Settings, SettingsWriteDto, User } from "@/types";
import { API_ENDPOINTS } from "@/constants";

export const settingsService = {
  async get(): Promise<Settings | null> {
    try {
      const res = await apiClient.get(API_ENDPOINTS.SETTINGS);
      return unwrap<Settings>(res.data);
    } catch {
      return null;
    }
  },

  async update(dto: Partial<SettingsWriteDto>): Promise<Settings> {
    // The backend exposes PATCH /settings.  Keep the verb explicit here so
    // this request can never fall back to a form-style POST submission.
    const res = await apiClient.request({
      method: "PATCH",
      url: API_ENDPOINTS.SETTINGS,
      data: dto,
    });
    return unwrap<Settings>(res.data);
  },
};

export const userService = {
  async getProfile(): Promise<User> {
    const res = await apiClient.get(API_ENDPOINTS.USER_PROFILE);
    return unwrap<User>(res.data);
  },

  async updateProfile(dto: Partial<Pick<User, "fullName" | "bio" | "location">>): Promise<User> {
    const res = await apiClient.patch(API_ENDPOINTS.USER_PROFILE, dto);
    return unwrap<User>(res.data);
  },
};
