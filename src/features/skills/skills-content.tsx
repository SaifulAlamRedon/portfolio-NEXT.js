"use client";

import { motion } from "framer-motion";
import { SkillCard } from "@/components/cards/skill-card";
import { SectionHeader } from "@/components/common/section-header";
import { EmptyState } from "@/components/common/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useSkillsGrouped } from "@/hooks/use-skills";
import { SKILL_CATEGORIES } from "@/constants";

const CATEGORY_ICONS: Record<string, string> = {
  Frontend: "🎨",
  Backend: "⚙️",
  Database: "🗄️",
  DevOps: "🚀",
  Tools: "🛠️",
};

export function SkillsContent() {
  const { grouped, isLoading } = useSkillsGrouped();

  const categories = Object.keys(grouped).length > 0
    ? Object.keys(grouped)
    : [...SKILL_CATEGORIES];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader
        badge="Skills"
        title="What I"
        titleHighlight="Work With"
        description="Tools and technologies I use across the projects in this portfolio."
      />

      {isLoading ? (
        <div className="space-y-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="mb-6 h-7 w-32 rounded-lg" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="h-24 rounded-2xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <EmptyState title="No skills added yet" />
      ) : (
        <div className="space-y-14">
          {categories.map((category, catIdx) => {
            const skills = grouped[category] ?? [];
            if (!skills.length) return null;
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: catIdx * 0.1 }}
              >
                <div className="mb-6 flex items-center gap-3">
                  <span className="text-2xl">
                    {CATEGORY_ICONS[category] ?? "💡"}
                  </span>
                  <h2 className="text-2xl font-bold">{category}</h2>
                  <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                    {skills.length}
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {skills
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((skill, i) => (
                      <SkillCard key={skill.id} skill={skill} index={i} />
                    ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
