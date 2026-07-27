import apiClient, { unwrap } from "./axios";
import type { ContactDto, ContactMessage } from "@/types";
import { API_ENDPOINTS } from "@/constants";

export const contactService = {
  async send(dto: ContactDto): Promise<{ message: string }> {
    const res = await apiClient.post(API_ENDPOINTS.CONTACT, dto);
    return { message: res.data?.message ?? "Message sent" };
  },

  // Admin only
  async getMessages(): Promise<ContactMessage[]> {
    const res = await apiClient.get(API_ENDPOINTS.CONTACT_MESSAGES);
    return unwrap<ContactMessage[]>(res.data);
  },

  async markRead(id: string): Promise<ContactMessage> {
    const res = await apiClient.patch(`${API_ENDPOINTS.CONTACT_MESSAGES}/${id}/read`);
    return unwrap<ContactMessage>(res.data);
  },

  async markUnread(id: string): Promise<ContactMessage> {
    const res = await apiClient.patch(`${API_ENDPOINTS.CONTACT_MESSAGES}/${id}/unread`);
    return unwrap<ContactMessage>(res.data);
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.CONTACT_MESSAGES}/${id}`);
  },
};
