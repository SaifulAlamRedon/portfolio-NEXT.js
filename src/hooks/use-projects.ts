"use client";

import { useQuery } from "@tanstack/react-query";
import { projectService, deriveCategories, deriveTechnologies } from "@/services/project.service";
import { QUERY_KEYS } from "@/constants";
import type { ProjectFilters } from "@/types";

export function useProjects(filters?: ProjectFilters) {
  return useQuery({
    queryKey: [...QUERY_KEYS.PROJECTS, filters],
    queryFn: () => projectService.getAll(filters),
  });
}

export function useFeaturedProjects() {
  return useQuery({
    queryKey: [...QUERY_KEYS.PROJECTS, "featured"],
    queryFn: projectService.getFeatured,
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PROJECT(slug),
    queryFn: () => projectService.getBySlugOrId(slug),
    enabled: !!slug,
  });
}

// The backend has no "distinct categories/technologies" endpoint, so these
// are derived from the full project list (already fetched by useProjects)
// instead of hitting endpoints that don't exist.
export function useProjectFilterOptions() {
  const { data: projects, ...rest } = useProjects();
  return {
    ...rest,
    categories: projects ? deriveCategories(projects) : [],
    technologies: projects ? deriveTechnologies(projects) : [],
  };
}
