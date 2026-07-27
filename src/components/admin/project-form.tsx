"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { projectService } from "@/services/project.service";
import type { Project } from "@/types";

const schema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  images: z.string().optional(), // newline-separated URLs
  category: z.string().optional(),
  technologies: z.string().optional(), // comma-separated
  githubUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  featured: z.boolean(),
});
type FormData = z.infer<typeof schema>;

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = !!project;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: project?.title ?? "",
      slug: project?.slug ?? "",
      shortDescription: project?.shortDescription ?? "",
      description: project?.description ?? "",
      coverImage: project?.coverImage ?? "",
      images: project?.images?.join("\n") ?? "",
      category: project?.category?.name ?? "",
      technologies: project?.technologies?.map((t) => t.name).join(", ") ?? "",
      githubUrl: project?.githubUrl ?? "",
      liveUrl: project?.liveUrl ?? "",
      status: (project?.status as "draft" | "published" | "archived") ?? "draft",
      featured: project?.featured ?? false,
    },
  });

  const featured = watch("featured");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        title: data.title,
        slug: data.slug || undefined,
        shortDescription: data.shortDescription || undefined,
        description: data.description || undefined,
        coverImage: data.coverImage || undefined,
        images: data.images
          ? data.images.split("\n").map((s) => s.trim()).filter(Boolean)
          : undefined,
        category: data.category || undefined,
        technologies: data.technologies
          ? data.technologies.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined,
        githubUrl: data.githubUrl || undefined,
        liveUrl: data.liveUrl || undefined,
        status: data.status,
        featured: data.featured,
      };

      if (isEdit) {
        await projectService.update(project.id, payload);
        toast.success("Project updated");
      } else {
        await projectService.create(payload);
        toast.success("Project created");
      }
      router.push("/admin/projects");
      router.refresh();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string | string[] } } })?.response?.data
          ?.message;
      toast.error(Array.isArray(message) ? message.join(", ") : message ?? "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" {...register("title")} />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug (optional — auto-generated if empty)</Label>
          <Input id="slug" placeholder="my-project" {...register("slug")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="category">Category</Label>
          <Input id="category" placeholder="Web App" {...register("category")} />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="shortDescription">Short description</Label>
          <Input id="shortDescription" placeholder="One-line summary for project cards" {...register("shortDescription")} />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="description">Full description</Label>
          <Textarea id="description" rows={6} {...register("description")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="coverImage">Cover image URL</Label>
          <Input id="coverImage" placeholder="https://…" {...register("coverImage")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="technologies">Technologies (comma-separated)</Label>
          <Input id="technologies" placeholder="React, Node.js, PostgreSQL" {...register("technologies")} />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="images">Gallery image URLs (one per line)</Label>
          <Textarea id="images" rows={3} {...register("images")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input id="githubUrl" placeholder="https://github.com/…" {...register("githubUrl")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="liveUrl">Live URL</Label>
          <Input id="liveUrl" placeholder="https://…" {...register("liveUrl")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            className="flex h-10 w-full rounded-xl border border-border bg-card px-3 text-sm"
            {...register("status")}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="flex items-center gap-2 pt-6">
          <input
            id="featured"
            type="checkbox"
            className="h-4 w-4 rounded border-border"
            checked={featured}
            onChange={(e) => setValue("featured", e.target.checked)}
          />
          <Label htmlFor="featured" className="cursor-pointer">
            Featured project
          </Label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="gradient" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving…
            </>
          ) : isEdit ? (
            "Save Changes"
          ) : (
            "Create Project"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
