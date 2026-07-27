"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";
import { SectionHeader } from "@/components/common/section-header";
import { Badge } from "@/components/ui/badge";
import { useExperiences } from "@/hooks/use-experiences";
import { getDateRange, getDuration } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";

export function ExperienceTimeline() {
  const { data: experiences, isLoading } = useExperiences();

  return (
    <section className="relative py-24">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 nebula-bg opacity-50" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Experience"
          title="Work"
          titleHighlight="History"
          description="A brief look at the roles, responsibilities, and teams that have shaped my work."
        />

        {isLoading ? (
          <div className="space-y-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : !experiences?.length ? (
          <EmptyState title="No experiences yet" />
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 hidden w-px bg-gradient-to-b from-primary/60 via-primary/20 to-transparent sm:block" />

            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex gap-6"
                >
                  {/* Timeline dot */}
                  <div className="relative hidden sm:flex shrink-0 flex-col items-center">
                    <div
                      className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border-2 transition-colors ${
                        exp.currentlyWorking
                          ? "border-primary/50 bg-primary/10"
                          : "border-border bg-card"
                      }`}
                    >
                      <Briefcase className="h-6 w-6 text-muted-foreground" />
                    </div>
                    {exp.currentlyWorking && (
                      <div className="mt-2 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 glass rounded-2xl p-6 transition-all hover:border-primary/40">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold">{exp.position}</h3>
                        <p className="text-base font-semibold text-primary">{exp.company}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {exp.currentlyWorking && (
                          <Badge variant="success">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Current
                          </Badge>
                        )}
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{getDateRange(exp.startDate, exp.endDate, exp.currentlyWorking)}</span>
                          <span className="text-muted-foreground/50">·</span>
                          <span>{getDuration(exp.startDate, exp.endDate, exp.currentlyWorking)}</span>
                        </div>
                      </div>
                    </div>

                    {exp.description && (
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
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
    </section>
  );
}
