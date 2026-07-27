"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FolderKanban, Sparkles, Briefcase, GraduationCap,
  Award, MessageSquareQuote, Mail, Settings, LogOut,
} from "lucide-react";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store";
import { cn } from "@/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/skills", label: "Skills", icon: Sparkles },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = async () => {
    await authService.logout();
    clearAuth();
    router.replace("/admin/login");
  };

  return (
    <aside className="flex h-screen w-[4.5rem] shrink-0 flex-col border-r border-border bg-card lg:w-64">
      <div className="flex h-16 items-center justify-center gap-2 border-b border-border px-3 lg:justify-start lg:px-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">A</span>
        <span className="hidden text-lg font-bold text-gradient lg:inline">Admin Panel</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-2 lg:p-4">
        {links.map((link) => {
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors lg:justify-start",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              title={link.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="hidden lg:inline">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-2 lg:p-4">
        <div className="mb-3 hidden px-2 lg:block">
          <p className="truncate text-sm font-medium">{user?.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive lg:justify-start"
          title="Log out"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden lg:inline">Log out</span>
        </button>
      </div>
    </aside>
  );
}
