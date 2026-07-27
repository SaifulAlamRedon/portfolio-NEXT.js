import apiClient, { unwrap } from "./axios";
import type { Experience, ExperienceWriteDto } from "@/types";
import { API_ENDPOINTS } from "@/constants";

export const experienceService = {
  async getAll(): Promise<Experience[]> {
    const res = await apiClient.get(API_ENDPOINTS.EXPERIENCES);
    return unwrap<Experience[]>(res.data);
  },

  async create(dto: ExperienceWriteDto): Promise<Experience> {
    const res = await apiClient.post(API_ENDPOINTS.EXPERIENCES, dto);
    return unwrap<Experience>(res.data);
  },

  async update(id: string, dto: Partial<ExperienceWriteDto>): Promise<Experience> {
    const res = await apiClient.patch(`${API_ENDPOINTS.EXPERIENCES}/${id}`, dto);
    return unwrap<Experience>(res.data);
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.EXPERIENCES}/${id}`);
  },
};
