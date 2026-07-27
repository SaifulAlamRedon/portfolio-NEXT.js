// ─── API envelope ──────────────────────────────────────────────────────────
// Every endpoint in the NestJS backend (except /auth/*) responds with this
// wrapper shape: { success, message, data }. Services must unwrap `.data`.
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

// Raw shape returned directly (not wrapped) by /auth/login, /auth/register
export interface AuthResponse {
  message: string;
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

// ─── User (full profile, from /users/profile) ────────────────────────────────
export interface User {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  bio?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  location?: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
}

// ─── Shared relation entities ────────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
}

export interface Technology {
  id: string;
  name: string;
}

// ─── Project ─────────────────────────────────────────────────────────────────
// READ shape: category/technologies come back as relation objects.
export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  coverImage?: string;
  images?: string[];
  technologies?: Technology[];
  category?: Category;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  status: "draft" | "published" | "archived" | string;
  viewCount: number;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

// WRITE shape: category/technologies are sent as plain strings; backend
// finds-or-creates the relation rows.
export interface ProjectWriteDto {
  title: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  coverImage?: string;
  images?: string[];
  technologies?: string[];
  category?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  status?: string;
}

export interface ProjectFilters {
  search?: string;
  category?: string;
  technology?: string;
  featured?: boolean;
  status?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

// ─── Skill ───────────────────────────────────────────────────────────────────
export type SkillCategory = "Frontend" | "Backend" | "Database" | "DevOps" | "Tools" | string;

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  percentage: number; // 0-100
  icon?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SkillWriteDto {
  name: string;
  category?: string;
  percentage?: number;
  icon?: string;
  displayOrder?: number;
}

// ─── Experience ───────────────────────────────────────────────────────────────
export interface Experience {
  id: string;
  company: string;
  position: string;
  employmentType: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;
  currentlyWorking: boolean;
  technologies?: Technology[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExperienceWriteDto {
  company: string;
  position: string;
  employmentType?: string;
  startDate: string;
  endDate?: string;
  currentlyWorking?: boolean;
  technologies?: string[];
  description?: string;
}

// ─── Education ────────────────────────────────────────────────────────────────
export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EducationWriteDto {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear?: number;
  description?: string;
}

// ─── Certificate ─────────────────────────────────────────────────────────────
export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateWriteDto {
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  image?: string;
}

// ─── Testimonial ─────────────────────────────────────────────────────────────
export interface Testimonial {
  id: string;
  name: string;
  company?: string;
  designation?: string;
  photo?: string;
  rating: number;
  message: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialWriteDto {
  name: string;
  company?: string;
  designation?: string;
  photo?: string;
  rating?: number;
  message: string;
}

// ─── Contact ─────────────────────────────────────────────────────────────────
export interface ContactDto {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Settings ────────────────────────────────────────────────────────────────
export interface Settings {
  id: string;
  siteName: string;
  logo?: string;
  favicon?: string;
  resumeUrl?: string;
  aboutMe?: string;
  contactEmail?: string;
  phone?: string;
  address?: string;
  github?: string;
  linkedIn?: string;
  facebook?: string;
  twitter?: string;
  themeColor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsWriteDto {
  siteName?: string;
  logo?: string;
  favicon?: string;
  resumeUrl?: string;
  aboutMe?: string;
  contactEmail?: string;
  phone?: string;
  address?: string;
  github?: string;
  linkedIn?: string;
  facebook?: string;
  twitter?: string;
  themeColor?: string;
}

// ─── Analytics ───────────────────────────────────────────────────────────────
export interface VisitorStats {
  total: number;
  monthly: number;
  daily: number;
}
