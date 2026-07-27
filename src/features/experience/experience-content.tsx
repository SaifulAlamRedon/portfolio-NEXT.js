"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";
import { SectionHeader } from "@/components/common/section-header";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { useExperiences } from "@/hooks/use-experiences";
import { getDateRange, getDuration } from "@/utils";

export function ExperienceContent() {
  const { data: experiences, isLoading } = useExperiences();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader
        badge="Career"
        title="Work"
        titleHighlight="Experience"
        description="Roles and responsibilities that reflect my professional experience so far."
      />

      {isLoading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : !experiences?.length ? (
        <EmptyState title="No experience added yet" />
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-cyan-500/30 to-transparent hidden sm:block" />

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="relative flex gap-6"
              >
                {/* Logo */}
                <div className="relative hidden sm:flex shrink-0 flex-col items-center">
                  <div
                    className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border-2 ${
                      exp.currentlyWorking
                        ? "border-violet-500/50 bg-violet-500/10"
                        : "border-border bg-card"
                    }`}
                  >
                    <Briefcase className="h-6 w-6 text-muted-foreground" />
                  </div>
                  {exp.currentlyWorking && (
                    <div className="mt-2 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </div>

                {/* Card */}
                <div className="flex-1 glass rounded-2xl p-6 transition-all hover:border-violet-500/30">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold">{exp.position}</h3>
                      <p className="text-base font-semibold text-primary">{exp.company}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      {exp.currentlyWorking && (
                        <Badge variant="success">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Current
                        </Badge>
                      )}
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {getDateRange(exp.startDate, exp.endDate, exp.currentlyWorking)}
                        <span className="text-muted-foreground/50">·</span>
                        {getDuration(exp.startDate, exp.endDate, exp.currentlyWorking)}
                      </span>
                    </div>
                  </div>

                  {exp.description && (
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {exp.technologies.map((tech) => (
                        <Badge key={tech.id} variant="outline" className="text-xs">
                          {tech.name}
                        </Badge>
                      ))}
                    </div>
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
