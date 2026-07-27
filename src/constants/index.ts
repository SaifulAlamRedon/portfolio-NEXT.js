export const SITE_CONFIG = {
  name: "Portfolio",
  description: "Full-Stack Developer & UI/UX Engineer",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ogImage: "/og.png",
  links: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
  },
} as const;

// NOTE: every path below was checked against the actual NestJS controllers in
// portfolio-REST-API. A few endpoints the frontend used to call (e.g.
// /projects/categories, /projects/technologies, /users/bio) don't exist on
// the backend at all — those have been removed; category/technology lists
// are now derived client-side from the project list instead.
export const API_ENDPOINTS = {
  // Auth (POST /auth/login etc. return data directly, NOT wrapped)
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/register",
  AUTH_REFRESH: "/auth/refresh",
  AUTH_LOGOUT: "/auth/logout",
  AUTH_ME: "/auth/me",
  AUTH_CHANGE_PASSWORD: "/auth/change-password",

  // User (admin's own profile)
  USER_PROFILE: "/users/profile",
  USER_AVATAR: "/users/avatar",
  USER_CHANGE_PASSWORD: "/users/change-password",
  USER_SOCIAL_LINKS: "/users/social-links",
  USER_BIO: "/users/bio",
  USER_LOCATION: "/users/location",

  // Projects
  PROJECTS: "/projects",
  PROJECT_SEARCH: "/projects/search",
  PROJECT_FEATURED: "/projects/featured",

  // Skills
  SKILLS: "/skills",
  SKILLS_REORDER: "/skills/reorder",

  // Experience
  EXPERIENCES: "/experiences",

  // Education
  EDUCATION: "/education",

  // Certificates
  CERTIFICATES: "/certificates",

  // Testimonials
  TESTIMONIALS: "/testimonials",
  TESTIMONIALS_PENDING: "/testimonials/pending",

  // Contact
  CONTACT: "/contact",
  CONTACT_EMAIL: "/contact/send-email",
  CONTACT_MESSAGES: "/contact/messages",
  CONTACT_STATISTICS: "/contact/statistics",

  // Newsletter
  NEWSLETTER: "/newsletter",

  // Settings
  SETTINGS: "/settings",

  // Analytics
  ANALYTICS_VISITOR: "/analytics/visitor",
  ANALYTICS_PAGE_VIEW: "/analytics/page-view",
  ANALYTICS_PROJECT_VIEW: "/analytics/project-view",
  ANALYTICS_VISITORS_TOTAL: "/analytics/visitors/total",
  ANALYTICS_VISITORS_MONTHLY: "/analytics/visitors/monthly",
  ANALYTICS_VISITORS_DAILY: "/analytics/visitors/daily",
  ANALYTICS_PROJECTS_POPULAR: "/analytics/projects/popular",
  ANALYTICS_CONTACT: "/analytics/contact",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/experience", label: "Experience" },
  { href: "/education", label: "Education" },
  { href: "/certificates", label: "Certificates" },
  { href: "/contact", label: "Contact" },
  { href: "/resume", label: "Resume" },
] as const;

export const SKILL_CATEGORIES = [
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Tools",
] as const;

export const TECH_ICONS: Record<string, string> = {
  // Frontend
  React: "⚛️",
  "Next.js": "▲",
  TypeScript: "🔷",
  JavaScript: "🟡",
  Vue: "💚",
  Angular: "🔴",
  Svelte: "🟠",
  // Backend
  "Node.js": "🟢",
  NestJS: "🏰",
  Express: "🚂",
  Python: "🐍",
  Django: "🎸",
  FastAPI: "⚡",
  // Database
  PostgreSQL: "🐘",
  MongoDB: "🍃",
  Redis: "🔴",
  MySQL: "🐬",
  // DevOps
  Docker: "🐳",
  Kubernetes: "⚙️",
  AWS: "☁️",
  Vercel: "▲",
  // Default
  default: "💻",
};

export const QUERY_KEYS = {
  PROFILE: ["profile"] as const,
  PROJECTS: ["projects"] as const,
  PROJECT: (slug: string) => ["project", slug] as const,
  SKILLS: ["skills"] as const,
  EXPERIENCES: ["experiences"] as const,
  EDUCATION: ["education"] as const,
  CERTIFICATES: ["certificates"] as const,
  TESTIMONIALS: ["testimonials"] as const,
  TESTIMONIALS_PENDING: ["testimonials", "pending"] as const,
  SETTINGS: ["settings"] as const,
  ANALYTICS: ["analytics"] as const,
  CONTACT_MESSAGES: ["contact-messages"] as const,
} as const;

export const ADMIN_NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/education", label: "Education" },
  { href: "/admin/certificates", label: "Certificates" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/settings", label: "Settings" },
] as const;

export const ANIMATION_VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  },
  fadeUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  },
  staggerChildren: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  },
} as const;
