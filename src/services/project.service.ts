import apiClient, { unwrap } from "./axios";
import type { Project, ProjectFilters, ProjectWriteDto } from "@/types";
import { API_ENDPOINTS } from "@/constants";

export const projectService = {
  async getAll(filters?: ProjectFilters): Promise<Project[]> {
    const res = await apiClient.get(API_ENDPOINTS.PROJECTS, { params: filters });
    return unwrap<Project[]>(res.data);
  },

  async getFeatured(): Promise<Project[]> {
    const res = await apiClient.get(API_ENDPOINTS.PROJECTS, { params: { featured: "true" } });
    return unwrap<Project[]>(res.data);
  },

  // Backend's GET /projects/:id looks up by id OR slug, so this works for
  // both project detail pages (slug in the URL) and admin edit forms (id).
  async getBySlugOrId(slugOrId: string): Promise<Project> {
    const res = await apiClient.get(`${API_ENDPOINTS.PROJECTS}/${slugOrId}`);
    return unwrap<Project>(res.data);
  },

  async create(dto: ProjectWriteDto): Promise<Project> {
    const res = await apiClient.post(API_ENDPOINTS.PROJECTS, dto);
    return unwrap<Project>(res.data);
  },

  async update(id: string, dto: Partial<ProjectWriteDto>): Promise<Project> {
    const res = await apiClient.patch(`${API_ENDPOINTS.PROJECTS}/${id}`, dto);
    return unwrap<Project>(res.data);
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.PROJECTS}/${id}`);
  },

  async toggleFeatured(id: string): Promise<Project> {
    const res = await apiClient.patch(`${API_ENDPOINTS.PROJECTS}/${id}/featured`);
    return unwrap<Project>(res.data);
  },

  async publish(id: string): Promise<Project> {
    const res = await apiClient.patch(`${API_ENDPOINTS.PROJECTS}/${id}/publish`);
    return unwrap<Project>(res.data);
  },

  async unpublish(id: string): Promise<Project> {
    const res = await apiClient.patch(`${API_ENDPOINTS.PROJECTS}/${id}/unpublish`);
    return unwrap<Project>(res.data);
  },
};

// Categories/technologies have no dedicated "list distinct values" endpoint
// on the backend, so we derive them client-side from the already-fetched
// project list instead of calling endpoints that don't exist.
export function deriveCategories(projects: Project[]): string[] {
  const set = new Set<string>();
  projects.forEach((p) => p.category?.name && set.add(p.category.name));
  return Array.from(set).sort();
}

export function deriveTechnologies(projects: Project[]): string[] {
  const set = new Set<string>();
  projects.forEach((p) => p.technologies?.forEach((t) => set.add(t.name)));
  return Array.from(set).sort();
}
