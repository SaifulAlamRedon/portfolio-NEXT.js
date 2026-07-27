"use client";

import { useQuery } from "@tanstack/react-query";
import { skillService } from "@/services/skill.service";
import { QUERY_KEYS } from "@/constants";
import { groupBy } from "@/utils";
import type { Skill } from "@/types";

export function useSkills() {
  return useQuery({
    queryKey: QUERY_KEYS.SKILLS,
    queryFn: skillService.getAll,
  });
}

export function useSkillsGrouped() {
  const query = useSkills();
  const grouped = query.data ? groupBy<Skill>(query.data, "category") : {};
  return { ...query, grouped };
}
