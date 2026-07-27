"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SkillCard } from "@/components/cards/skill-card";
import { SectionHeader } from "@/components/common/section-header";
import { useSkillsGrouped } from "@/hooks/use-skills";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { useState } from "react";
import { SKILL_CATEGORIES } from "@/constants";
import { cn } from "@/utils";

export function SkillsOverview() {
  const { grouped, isLoading } = useSkillsGrouped();
  const availableCategories = Object.keys(grouped);
  const [activeTab, setActiveTab] = useState<string>("");

  const categories =
    availableCategories.length > 0
      ? availableCategories
      : [...SKILL_CATEGORIES];

  const currentCategory = activeTab || categories[0];
  const currentSkills = grouped[currentCategory] ?? [];

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Skills"
          title="Tools I"
          titleHighlight="Use"
          description="The technologies I use to design, build, and maintain web applications."
        />

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : availableCategories.length === 0 ? (
          <EmptyState title="No skills added yet" />
        ) : (
          <>
            {/* Category tabs */}
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                    currentCategory === cat
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                      : "border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  )}
                >
                  {cat}
                  {grouped[cat] && (
                    <span className="ml-2 text-xs opacity-60">({grouped[cat].length})</span>
                  )}
                </button>
              ))}
            </div>

            <motion.div
              key={currentCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {currentSkills
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((skill, i) => (
                  <SkillCard key={skill.id} skill={skill} index={i} />
                ))}
            </motion.div>
          </>
        )}

        <div className="mt-12 flex justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/skills">
              View All Skills
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
