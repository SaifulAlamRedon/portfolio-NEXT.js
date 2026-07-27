import apiClient, { unwrap } from "./axios";
import { API_ENDPOINTS } from "@/constants";
import { getVisitorId } from "@/utils";

// IMPORTANT: the backend's CreateAnalyticsDto only accepts { event?, source?,
// userId? } and the global ValidationPipe uses forbidNonWhitelisted: true —
// sending any other property (e.g. visitorId, browser, pageUrl, projectId)
// causes a 400 Bad Request. Every payload below is shaped to match the DTO
// exactly; page/project identifiers are passed via `source`.
export const analyticsService = {
  async trackVisitor(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.ANALYTICS_VISITOR, {
        event: "visit",
        source: typeof document !== "undefined" ? document.referrer || "direct" : "direct",
        userId: getVisitorId(),
      });
    } catch {
      // Non-critical — fail silently
    }
  },

  async trackPageView(pageUrl: string): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.ANALYTICS_PAGE_VIEW, {
        event: "page_view",
        source: pageUrl,
        userId: getVisitorId(),
      });
    } catch {
      // Non-critical
    }
  },

  async trackProjectView(projectId: string): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.ANALYTICS_PROJECT_VIEW, {
        event: "project_view",
        source: projectId,
        userId: getVisitorId(),
      });
    } catch {
      // Non-critical
    }
  },

  // Admin only
  async getTotalVisitors(): Promise<number> {
    const res = await apiClient.get(API_ENDPOINTS.ANALYTICS_VISITORS_TOTAL);
    const data = unwrap<{ totalVisitors: number }>(res.data);
    return data?.totalVisitors ?? 0;
  },

  async getMonthlyVisitors(): Promise<Array<Record<string, unknown>>> {
    const res = await apiClient.get(API_ENDPOINTS.ANALYTICS_VISITORS_MONTHLY);
    return unwrap(res.data);
  },

  async getPopularProjects(): Promise<Array<Record<string, unknown>>> {
    const res = await apiClient.get(API_ENDPOINTS.ANALYTICS_PROJECTS_POPULAR);
    return unwrap(res.data);
  },
};
