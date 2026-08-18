"use client";

import { usePathname } from "next/navigation";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function BackToTop() {
  const pathname = usePathname();
  const { scrollY } = useScroll(400);

  // Hide on admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {scrollY > 400 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Button
            onClick={scrollToTop}
            size="icon"
            variant="glass"
            className="h-11 w-11 rounded-full shadow-lg glow-purple"
            aria-label="Back to top"
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
