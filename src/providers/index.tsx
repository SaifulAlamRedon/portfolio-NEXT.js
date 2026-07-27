"use client";

import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgb(13 17 33 / 0.9)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgb(255 255 255 / 0.1)",
              color: "#f8fafc",
            },
          }}
        />
      </ThemeProvider>
    </QueryProvider>
  );
}
