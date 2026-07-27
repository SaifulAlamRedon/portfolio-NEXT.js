"use client";

import { useSkills } from "@/hooks/use-skills";
import { unique } from "@/utils";
import { motion } from "framer-motion";

export function TechMarquee() {
  const { data: skills } = useSkills();

  const technologies = unique((skills ?? []).map((skill) => skill.name)).slice(0, 20);

  if (technologies.length === 0) return null;

  const doubled = [...technologies, ...technologies];

  return (
    <section className="relative overflow-hidden border-y border-border py-6">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

      <div className="flex w-full overflow-hidden">
        <motion.div
          className="flex shrink-0 gap-6 pr-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {doubled.map((tech, i) => (
            <div
              key={`${tech}-${i}`}
              className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-muted/50 px-5 py-2 text-sm font-medium text-muted-foreground"
            >
              <span className="h-2 w-2 rounded-full bg-primary" />
              {tech}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
