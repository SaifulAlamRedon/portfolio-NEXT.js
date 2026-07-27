"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/cards/project-card";
import { SectionHeader } from "@/components/common/section-header";
import { Stagger, StaggerItem } from "@/components/animations/fade-in";
import { useFeaturedProjects } from "@/hooks/use-projects";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";

export function FeaturedProjects() {
  const { data: projects, isLoading } = useFeaturedProjects();

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Projects"
          title="Selected"
          titleHighlight="Projects"
          description="A few projects that show how I approach problems, make decisions, and turn ideas into working products."
        />

        {isLoading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border overflow-hidden">
                <Skeleton className="h-52 rounded-none" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : !projects?.length ? (
          <EmptyState title="No featured projects yet" description="Featured work will appear here once it is ready to share." />
        ) : (
          <Stagger className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <StaggerItem key={project.id}>
                <ProjectCard project={project} featured />
              </StaggerItem>
            ))}
          </Stagger>
        )}

        <div className="mt-12 flex justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/projects">
              View All Projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
