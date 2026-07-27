"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, User, Briefcase, Code, GraduationCap, Award, Mail, FileText,
  Layers, Search, X
} from "lucide-react";
import { useUIStore } from "@/store";
import { NAV_LINKS } from "@/constants";

const icons: Record<string, React.ReactNode> = {
  "/": <Home className="h-4 w-4" />,
  "/about": <User className="h-4 w-4" />,
  "/projects": <Layers className="h-4 w-4" />,
  "/skills": <Code className="h-4 w-4" />,
  "/experience": <Briefcase className="h-4 w-4" />,
  "/education": <GraduationCap className="h-4 w-4" />,
  "/certificates": <Award className="h-4 w-4" />,
  "/contact": <Mail className="h-4 w-4" />,
  "/resume": <FileText className="h-4 w-4" />,
};

export function CommandPalette() {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === "Escape") setCommandPaletteOpen(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  const navigate = (href: string) => {
    router.push(href);
    setCommandPaletteOpen(false);
  };

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandPaletteOpen(false)}
          />

          {/* Panel */}
          <motion.div
            className="fixed left-1/2 top-1/4 z-50 w-full max-w-lg -translate-x-1/2"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.18 }}
          >
            <Command className="glass-strong rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center border-b border-white/10 px-4">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <Command.Input
                  placeholder="Search pages…"
                  className="flex h-12 w-full bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
                />
                <button
                  onClick={() => setCommandPaletteOpen(false)}
                  className="text-muted-foreground hover:text-foreground ml-2"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <Command.List className="max-h-72 overflow-y-auto p-2">
                <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
                  No results found.
                </Command.Empty>

                <Command.Group heading="Navigation" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
                  {NAV_LINKS.map((link) => (
                    <Command.Item
                      key={link.href}
                      value={link.label}
                      onSelect={() => navigate(link.href)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm cursor-pointer hover:bg-white/10 aria-selected:bg-white/10 transition-colors"
                    >
                      <span className="text-muted-foreground">{icons[link.href]}</span>
                      <span>{link.label}</span>
                      <kbd className="ml-auto text-[10px] text-muted-foreground">↵</kbd>
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>

              <div className="border-t border-white/10 px-4 py-2 text-xs text-muted-foreground flex items-center gap-4">
                <span><kbd className="rounded bg-white/10 px-1 py-0.5">↑↓</kbd> Navigate</span>
                <span><kbd className="rounded bg-white/10 px-1 py-0.5">↵</kbd> Select</span>
                <span><kbd className="rounded bg-white/10 px-1 py-0.5">Esc</kbd> Close</span>
              </div>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
