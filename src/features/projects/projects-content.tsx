"use client";

import { useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { ProjectCard } from "@/components/cards/project-card";
import { SectionHeader } from "@/components/common/section-header";
import { Stagger, StaggerItem } from "@/components/animations/fade-in";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { useProjects, useProjectFilterOptions } from "@/hooks/use-projects";
import { cn } from "@/utils";
import type { Project } from "@/types";

export function ProjectsContent() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTech, setActiveTech] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const { data: projects, isLoading } = useProjects();
  const { categories, technologies } = useProjectFilterOptions();

  const allCategories = ["All", ...(categories ?? [])];
  const allTechs = ["All", ...(technologies ?? []).slice(0, 10)];

  const filtered: Project[] = (projects ?? []).filter((p) => {
    const description = p.shortDescription ?? p.description ?? "";
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === "All" || p.category?.name === activeCategory;
    const matchesTech =
      activeTech === "All" || (p.technologies ?? []).some((t) => t.name === activeTech);
    return matchesSearch && matchesCat && matchesTech && p.status === "published";
  });

  const hasFilters = activeCategory !== "All" || activeTech !== "All" || search;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader
        badge="Portfolio"
        title="Project"
        titleHighlight="Archive"
        description="Browse the work here by topic, technology, or the problem it was built to solve."
      />

      {/* Search & filters */}
      <div className="mb-10 space-y-4">
        <div className="flex gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters((v) => !v)}
            className={cn(showFilters && "border-primary/50 bg-primary/5")}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {hasFilters && (
              <span className="ml-1 h-2 w-2 rounded-full bg-primary" />
            )}
          </Button>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setSearch(""); setActiveCategory("All"); setActiveTech("All"); }}
            >
              Clear
            </Button>
          )}
        </div>

        {/* Expandable filters */}
        {showFilters && (
          <div className="glass rounded-2xl p-5 space-y-4">
            {/* Categories */}
            {categories && categories.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Category
                </p>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        "rounded-full px-3 py-1 text-sm transition-all",
                        activeCategory === cat
                          ? "bg-primary text-primary-foreground"
                          : "border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies */}
            {technologies && technologies.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Technology
                </p>
                <div className="flex flex-wrap gap-2">
                  {allTechs.map((tech) => (
                    <button
                      key={tech}
                      onClick={() => setActiveTech(tech)}
                      className={cn(
                        "rounded-full px-3 py-1 text-sm transition-all",
                        activeTech === tech
                          ? "bg-primary text-primary-foreground"
                          : "border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      )}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border overflow-hidden">
              <Skeleton className="h-52 rounded-none" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No projects found"
          description="Try adjusting your search or filter criteria."
          action={
            hasFilters ? (
              <Button
                variant="outline"
                onClick={() => { setSearch(""); setActiveCategory("All"); setActiveTech("All"); }}
              >
                Clear Filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <p className="mb-6 text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
            project{filtered.length !== 1 ? "s" : ""}
          </p>
          <Stagger className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <StaggerItem key={project.id}>
                <ProjectCard project={project} />
              </StaggerItem>
            ))}
          </Stagger>
        </>
      )}
    </div>
  );
}
