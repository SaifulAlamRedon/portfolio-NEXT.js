import apiClient, { unwrap } from "./axios";
import type { Skill, SkillWriteDto } from "@/types";
import { API_ENDPOINTS } from "@/constants";

export const skillService = {
  async getAll(): Promise<Skill[]> {
    const res = await apiClient.get(API_ENDPOINTS.SKILLS);
    return unwrap<Skill[]>(res.data);
  },

  async getByCategory(category: string): Promise<Skill[]> {
    const all = await this.getAll();
    return all.filter((s) => s.category === category);
  },

  async create(dto: SkillWriteDto): Promise<Skill> {
    const res = await apiClient.post(API_ENDPOINTS.SKILLS, dto);
    return unwrap<Skill>(res.data);
  },

  async update(id: string, dto: Partial<SkillWriteDto>): Promise<Skill> {
    const res = await apiClient.patch(`${API_ENDPOINTS.SKILLS}/${id}`, dto);
    return unwrap<Skill>(res.data);
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.SKILLS}/${id}`);
  },
};
