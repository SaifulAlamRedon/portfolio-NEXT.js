"use client";

import { motion } from "framer-motion";
import { GraduationCap, Calendar } from "lucide-react";
import { SectionHeader } from "@/components/common/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { useEducation } from "@/hooks/use-experiences";

export function EducationContent() {
  const { data: education, isLoading } = useEducation();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader
        badge="Academic"
        title="My"
        titleHighlight="Education"
        description="The academic foundation that shaped my technical thinking and problem-solving approach."
      />

      {isLoading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
      ) : !education?.length ? (
        <EmptyState title="No education added yet" />
      ) : (
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-violet-500/30 to-transparent hidden sm:block" />

          <div className="space-y-8">
            {education.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex gap-6"
              >
                {/* Icon */}
                <div className="relative hidden sm:flex shrink-0 flex-col items-center">
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-border bg-card">
                    <GraduationCap className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>

                {/* Card */}
                <div className="flex-1 glass rounded-2xl p-6 transition-all hover:border-cyan-500/30">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold">{edu.degree}</h3>
                      {edu.fieldOfStudy && (
                        <p className="text-sm text-muted-foreground">{edu.fieldOfStudy}</p>
                      )}
                      <p className="mt-0.5 font-semibold text-primary">{edu.institution}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {edu.startYear}
                        {edu.endYear ? ` — ${edu.endYear}` : " — Present"}
                      </span>
                    </div>
                  </div>

                  {edu.description && (
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
