import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ─── Class name utility ───────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Date utilities ───────────────────────────────────────────────────────────
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    ...options,
  }).format(new Date(date));
}

export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
  }).format(new Date(date));
}

export function getDateRange(startDate: string, endDate?: string, isCurrent?: boolean): string {
  const start = formatDateShort(startDate);
  if (isCurrent) return `${start} — Present`;
  if (!endDate) return start;
  return `${start} — ${formatDateShort(endDate)}`;
}

export function getDuration(startDate: string, endDate?: string, isCurrent?: boolean): string {
  const start = new Date(startDate);
  const end = isCurrent || !endDate ? new Date() : new Date(endDate);
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
  if (months < 1) return "< 1 month";
  if (months < 12) return `${months} mo${months > 1 ? "s" : ""}`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return remainingMonths > 0 ? `${years} yr ${remainingMonths} mo` : `${years} yr${years > 1 ? "s" : ""}`;
}

// ─── String utilities ─────────────────────────────────────────────────────────
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + "…";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── Number utilities ─────────────────────────────────────────────────────────
export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

// ─── URL utilities ────────────────────────────────────────────────────────────
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

const NEXT_IMAGE_HOSTS = new Set([
  "res.cloudinary.com",
  "images.unsplash.com",
  "avatars.githubusercontent.com",
  "github.com",
  "via.placeholder.com",
  "example.com",
  "localhost",
]);

/** Returns true only for local paths or remote hosts allowed by next.config.ts. */
export function isNextImageSource(src?: string): src is string {
  if (!src) return false;
  if (src.startsWith("/")) return true;

  try {
    const url = new URL(src);
    return (url.protocol === "https:" || url.protocol === "http:") && NEXT_IMAGE_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

export function getInitials(nameOrFirstName: string, lastName?: string): string {
  if (lastName !== undefined) {
    const first = nameOrFirstName?.charAt(0)?.toUpperCase() ?? "";
    const last = lastName?.charAt(0)?.toUpperCase() ?? "";
    return `${first}${last}` || "?";
  }
  const parts = (nameOrFirstName ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// ─── Array utilities ──────────────────────────────────────────────────────────
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce(
    (acc, item) => {
      const groupKey = String(item[key]);
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );
}

export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

// ─── Clipboard ────────────────────────────────────────────────────────────────
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// ─── Color utilities ──────────────────────────────────────────────────────────
export function getSkillLevelLabel(level: number): string {
  if (level >= 90) return "Expert";
  if (level >= 75) return "Advanced";
  if (level >= 60) return "Proficient";
  if (level >= 40) return "Intermediate";
  return "Beginner";
}

export function getSkillLevelColor(level: number): string {
  if (level >= 90) return "text-emerald-500";
  if (level >= 75) return "text-blue-500";
  if (level >= 60) return "text-violet-500";
  if (level >= 40) return "text-yellow-500";
  return "text-red-500";
}

// ─── Share utilities ──────────────────────────────────────────────────────────
export function shareProject(title: string, url: string) {
  if (typeof navigator !== "undefined" && navigator.share) {
    return navigator.share({ title, url });
  }
  return copyToClipboard(url);
}

// ─── Visitor ID ───────────────────────────────────────────────────────────────
export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  const stored = localStorage.getItem("visitorId");
  if (stored) return stored;
  const id = crypto.randomUUID();
  localStorage.setItem("visitorId", id);
  return id;
}

// ─── Settings helpers ─────────────────────────────────────────────────────────
// The backend's Settings entity stores social links as flat columns
// (github, linkedIn, facebook, twitter), not a nested object. This adapts
// them into the { platform: url } shape components want to iterate over.
export function getSocialLinksFromSettings(settings?: {
  github?: string;
  linkedIn?: string;
  facebook?: string;
  twitter?: string;
} | null): Record<string, string> {
  if (!settings) return {};
  const links: Record<string, string> = {};
  if (settings.github) links.github = settings.github;
  if (settings.linkedIn) links.linkedin = settings.linkedIn;
  if (settings.facebook) links.facebook = settings.facebook;
  if (settings.twitter) links.twitter = settings.twitter;
  return links;
}

// ─── Debounce ─────────────────────────────────────────────────────────────────
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}
