import apiClient, { unwrap } from "./axios";
import type { Education, EducationWriteDto } from "@/types";
import { API_ENDPOINTS } from "@/constants";

export const educationService = {
  async getAll(): Promise<Education[]> {
    const res = await apiClient.get(API_ENDPOINTS.EDUCATION);
    return unwrap<Education[]>(res.data);
  },

  async create(dto: EducationWriteDto): Promise<Education> {
    const res = await apiClient.post(API_ENDPOINTS.EDUCATION, dto);
    return unwrap<Education>(res.data);
  },

  async update(id: string, dto: Partial<EducationWriteDto>): Promise<Education> {
    const res = await apiClient.patch(`${API_ENDPOINTS.EDUCATION}/${id}`, dto);
    return unwrap<Education>(res.data);
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.EDUCATION}/${id}`);
  },
};
