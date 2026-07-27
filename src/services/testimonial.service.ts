import apiClient, { unwrap } from "./axios";
import type { Testimonial, TestimonialWriteDto } from "@/types";
import { API_ENDPOINTS } from "@/constants";

export const testimonialService = {
  // Public: approved testimonials only (backend filters this server-side)
  async getApproved(): Promise<Testimonial[]> {
    const res = await apiClient.get(API_ENDPOINTS.TESTIMONIALS);
    return unwrap<Testimonial[]>(res.data);
  },

  async submit(dto: TestimonialWriteDto): Promise<Testimonial> {
    const res = await apiClient.post(API_ENDPOINTS.TESTIMONIALS, dto);
    return unwrap<Testimonial>(res.data);
  },

  // Admin only
  async getPending(): Promise<Testimonial[]> {
    const res = await apiClient.get(API_ENDPOINTS.TESTIMONIALS_PENDING);
    return unwrap<Testimonial[]>(res.data);
  },

  async approve(id: string): Promise<Testimonial> {
    const res = await apiClient.patch(`${API_ENDPOINTS.TESTIMONIALS}/${id}/approve`);
    return unwrap<Testimonial>(res.data);
  },

  async reject(id: string): Promise<Testimonial> {
    const res = await apiClient.patch(`${API_ENDPOINTS.TESTIMONIALS}/${id}/reject`);
    return unwrap<Testimonial>(res.data);
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.TESTIMONIALS}/${id}`);
  },
};
