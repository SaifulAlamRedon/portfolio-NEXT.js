"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store";

// Confirms the stored access token is actually still valid by calling
// GET /auth/me (rather than trusting localStorage alone), then redirects
// to /admin/login if it isn't.
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setUser, clearAuth } = useAuthStore();
  const [status, setStatus] = useState<"checking" | "ok">("checking");

  useEffect(() => {
    let cancelled = false;

    async function check() {
      if (!authService.isAuthenticated()) {
        router.replace("/admin/login");
        return;
      }
      try {
        const me = await authService.getMe();
        if (cancelled) return;
        if (me.role !== "admin") {
          clearAuth();
          router.replace("/admin/login");
          return;
        }
        setUser(me);
        setStatus("ok");
      } catch {
        if (cancelled) return;
        clearAuth();
        router.replace("/admin/login");
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, [router, setUser, clearAuth]);

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
