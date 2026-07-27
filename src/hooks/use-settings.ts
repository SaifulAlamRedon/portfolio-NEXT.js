"use client";

import { useQuery } from "@tanstack/react-query";
import { settingsService, userService } from "@/services/settings.service";
import { QUERY_KEYS } from "@/constants";

export function useSettings() {
  return useQuery({
    queryKey: QUERY_KEYS.SETTINGS,
    queryFn: settingsService.get,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProfile() {
  return useQuery({
    queryKey: QUERY_KEYS.PROFILE,
    queryFn: userService.getProfile,
    staleTime: 5 * 60 * 1000,
  });
}
