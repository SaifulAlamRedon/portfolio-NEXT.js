"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="relative text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <h1 className="text-[160px] font-bold leading-none text-gradient opacity-20 sm:text-[200px]">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="-mt-8"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">Page Not Found</h2>
          <p className="mt-4 max-w-sm mx-auto text-muted-foreground">
            The page you&apos;re looking for has drifted into the void. Let&apos;s get you back on track.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="gradient">
              <Link href="/">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button asChild size="lg" variant="glass">
              <Link href="/projects">
                <ArrowLeft className="h-4 w-4" />
                Browse Projects
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
