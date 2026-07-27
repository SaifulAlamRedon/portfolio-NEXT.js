import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/types";

// ─── Auth Store ───────────────────────────────────────────────────────────────
interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      clearAuth: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "auth-store" }
  )
);

// ─── UI Store ────────────────────────────────────────────────────────────────
interface UIState {
  isMobileMenuOpen: boolean;
  isCommandPaletteOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  toggleCommandPalette: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isCommandPaletteOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  toggleCommandPalette: () => set((s) => ({ isCommandPaletteOpen: !s.isCommandPaletteOpen })),
}));

// ─── Project Filter Store ────────────────────────────────────────────────────
interface ProjectFilterState {
  search: string;
  category: string;
  technology: string;
  setSearch: (s: string) => void;
  setCategory: (c: string) => void;
  setTechnology: (t: string) => void;
  reset: () => void;
}

export const useProjectFilterStore = create<ProjectFilterState>((set) => ({
  search: "",
  category: "",
  technology: "",
  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category }),
  setTechnology: (technology) => set({ technology }),
  reset: () => set({ search: "", category: "", technology: "" }),
}));
