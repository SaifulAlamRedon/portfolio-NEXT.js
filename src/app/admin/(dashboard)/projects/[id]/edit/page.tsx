"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProjectForm } from "@/components/admin/project-form";
import { Skeleton } from "@/components/ui/skeleton";
import { projectService } from "@/services/project.service";

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: project, isLoading } = useQuery({
    queryKey: ["admin", "project", id],
    queryFn: () => projectService.getBySlugOrId(id),
  });

  return (
    <div>
      <AdminPageHeader title="Edit Project" description="Update project details." />
      {isLoading ? (
        <div className="max-w-3xl space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : project ? (
        <ProjectForm project={project} />
      ) : (
        <p className="text-muted-foreground">Project not found.</p>
      )}
    </div>
  );
}
