"use client";

import { usePathname } from "next/navigation";
import { useScroll } from "@/hooks/use-scroll";
import { motion } from "framer-motion";

export function ScrollProgress() {
  const pathname = usePathname();
  const { scrollProgress } = useScroll();

  // Hide on admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] h-0.5 bg-gradient-to-r from-violet-600 via-cyan-500 to-violet-600 origin-left"
      style={{ scaleX: scrollProgress / 100, transformOrigin: "0%" }}
    />
  );
}
