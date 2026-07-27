"use client";

import { useQuery } from "@tanstack/react-query";
import { experienceService } from "@/services/experience.service";
import { educationService } from "@/services/education.service";
import { certificateService } from "@/services/certificate.service";
import { testimonialService } from "@/services/testimonial.service";
import { QUERY_KEYS } from "@/constants";

export function useExperiences() {
  return useQuery({
    queryKey: QUERY_KEYS.EXPERIENCES,
    queryFn: experienceService.getAll,
  });
}

export function useEducation() {
  return useQuery({
    queryKey: QUERY_KEYS.EDUCATION,
    queryFn: educationService.getAll,
  });
}

export function useCertificates() {
  return useQuery({
    queryKey: QUERY_KEYS.CERTIFICATES,
    queryFn: certificateService.getAll,
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: QUERY_KEYS.TESTIMONIALS,
    // Backend's GET /testimonials is already approved-only (Public route),
    // no client-side filtering needed.
    queryFn: testimonialService.getApproved,
  });
}
