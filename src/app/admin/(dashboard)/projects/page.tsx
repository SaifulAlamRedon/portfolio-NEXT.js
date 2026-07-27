"use client";

import Link from "next/link";
import Image from "next/image";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star, Eye, ExternalLink, Github } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { projectService } from "@/services/project.service";
import { isNextImageSource } from "@/utils";

export default function AdminProjectsPage() {
  const queryClient = useQueryClient();
  const { data: projects, isLoading } = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: () => projectService.getAll(),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });

  const removeMutation = useMutation({
    mutationFn: (id: string) => projectService.remove(id),
    onSuccess: () => {
      toast.success("Project deleted");
      invalidate();
    },
    onError: () => toast.error("Failed to delete project"),
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: (id: string) => projectService.toggleFeatured(id),
    onSuccess: () => invalidate(),
    onError: () => toast.error("Failed to update project"),
  });

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      removeMutation.mutate(id);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader
        title="Projects"
        description="Manage your portfolio projects."
        action={
          <Button asChild variant="gradient">
            <Link href="/admin/projects/new">
              <Plus className="h-4 w-4" /> New Project
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : !projects?.length ? (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">
          No projects yet. Create your first one.
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-wrap items-start gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/30 sm:flex-nowrap sm:items-center"
            >
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                {isNextImageSource(project.coverImage) ? (
                  <Image src={project.coverImage} alt={project.title} fill className="object-cover" sizes="80px" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                    No image
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate font-semibold">{project.title}</h3>
                  <Badge variant={project.status === "published" ? "success" : "outline"}>
                    {project.status}
                  </Badge>
                  {project.featured && (
                    <Badge variant="featured">
                      <Star className="h-3 w-3" /> Featured
                    </Badge>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  {project.category && <span>{project.category.name}</span>}
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {project.viewCount ?? 0}
                  </span>
                  {project.githubUrl && <Github className="h-3 w-3" />}
                  {project.liveUrl && <ExternalLink className="h-3 w-3" />}
                </div>
              </div>

              <div className="ml-auto flex w-full shrink-0 items-center justify-end gap-2 sm:w-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFeaturedMutation.mutate(project.id)}
                  title="Toggle featured"
                >
                  <Star className={`h-4 w-4 ${project.featured ? "fill-amber-400 text-amber-400" : ""}`} />
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/projects/${project.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(project.id, project.title)}
                  disabled={removeMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
