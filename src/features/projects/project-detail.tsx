"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Github, ExternalLink, ArrowLeft, Eye, Calendar, Share2, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn, Stagger, StaggerItem } from "@/components/animations/fade-in";
import { useProject, useProjects } from "@/hooks/use-projects";
import { ProjectCard } from "@/components/cards/project-card";
import { analyticsService } from "@/services/analytics.service";
import { formatDate, isNextImageSource, shareProject } from "@/utils";
import { toast } from "sonner";

interface ProjectDetailProps {
  slug: string;
}

export function ProjectDetail({ slug }: ProjectDetailProps) {
  const { data: project, isLoading, error } = useProject(slug);
  const { data: allProjects } = useProjects();

  const related = (allProjects ?? [])
    .filter((p) => p.slug !== slug && p.status === "published")
    .filter(
      (p) =>
        (project?.category && project.category.name === p.category?.name) ||
        (project?.technologies ?? []).some((t) =>
          (p.technologies ?? []).some((pt) => pt.name === t.name)
        )
    )
    .slice(0, 3);

  useEffect(() => {
    if (project?.id) {
      analyticsService.trackProjectView(project.id);
    }
  }, [project?.id]);

  const handleShare = async () => {
    await shareProject(
      project?.title ?? "Project",
      window.location.href
    );
    toast.success("Link copied to clipboard");
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-8">
        <Skeleton className="h-80 rounded-3xl" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-32 sm:px-6 lg:px-8 text-center">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <p className="mt-2 text-muted-foreground">
          This project doesn&apos;t exist or has been removed.
        </p>
        <Button asChild className="mt-6" variant="outline">
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </div>
    );
  }

  // NOTE: the backend's Project entity has no separate "content" JSON blob —
  // just shortDescription + description — so this is the full write-up.
  const sections = [
    { key: "overview", label: "Overview", content: project.description ?? project.shortDescription ?? "" },
  ].filter((s) => s.content);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Back */}
      <FadeIn>
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4" />
            All Projects
          </Link>
        </Button>
      </FadeIn>

      {/* Hero image */}
      <FadeIn className="mb-8">
        <div className="relative h-72 overflow-hidden rounded-3xl bg-muted sm:h-96">
          {isNextImageSource(project.coverImage) ? (
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 80vw"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-900/30 to-cyan-900/20 text-6xl">
              🖥️
            </div>
          )}

          {/* Overlay badges */}
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            {project.featured && (
              <Badge variant="featured">
                <Star className="h-3 w-3" />
                Featured
              </Badge>
            )}
            {project.category && (
              <Badge variant="glass">{project.category.name}</Badge>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Header */}
      <FadeIn>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">{project.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(project.createdAt)}
              </span>
              {project.viewCount !== undefined && (
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {project.viewCount} views
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            {project.githubUrl && (
              <Button asChild variant="outline" size="sm">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button asChild variant="gradient" size="sm">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </a>
              </Button>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Technologies */}
      {project.technologies && project.technologies.length > 0 && (
        <FadeIn className="mt-6">
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech.id} variant="default" className="text-sm">
                {tech.name}
              </Badge>
            ))}
          </div>
        </FadeIn>
      )}

      {/* Content sections */}
      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <FadeIn key={section.key}>
            <div className="glass rounded-2xl p-6">
              <h2 className="mb-3 text-lg font-bold capitalize">{section.label}</h2>
              <p className="leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {section.content}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Gallery */}
      {project.images?.some(isNextImageSource) && (
        <FadeIn className="mt-10">
          <h2 className="mb-4 text-xl font-bold">Gallery</h2>
          <Stagger className="grid gap-4 sm:grid-cols-2">
            {project.images.filter(isNextImageSource).map((img, i) => (
              <StaggerItem key={i}>
                <div className="relative h-48 overflow-hidden rounded-2xl">
                  <Image
                    src={img}
                    alt={`${project.title} screenshot ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </FadeIn>
      )}

      {/* Related projects */}
      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="mb-8 text-2xl font-bold">Related Projects</h2>
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <StaggerItem key={p.id}>
                <ProjectCard project={p} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      )}
    </div>
  );
}
