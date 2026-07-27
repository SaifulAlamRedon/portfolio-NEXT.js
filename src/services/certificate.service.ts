import apiClient, { unwrap } from "./axios";
import type { Certificate, CertificateWriteDto } from "@/types";
import { API_ENDPOINTS } from "@/constants";

export const certificateService = {
  async getAll(): Promise<Certificate[]> {
    const res = await apiClient.get(API_ENDPOINTS.CERTIFICATES);
    return unwrap<Certificate[]>(res.data);
  },

  async create(dto: CertificateWriteDto): Promise<Certificate> {
    const res = await apiClient.post(API_ENDPOINTS.CERTIFICATES, dto);
    return unwrap<Certificate>(res.data);
  },

  async update(id: string, dto: Partial<CertificateWriteDto>): Promise<Certificate> {
    const res = await apiClient.patch(`${API_ENDPOINTS.CERTIFICATES}/${id}`, dto);
    return unwrap<Certificate>(res.data);
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.CERTIFICATES}/${id}`);
  },
};
