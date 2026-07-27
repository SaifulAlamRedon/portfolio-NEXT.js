"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Github, ExternalLink, Star, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, isNextImageSource, truncate } from "@/utils";
import type { Project } from "@/types";
import { cn } from "@/utils";

interface ProjectCardProps {
  project: Project;
  className?: string;
  featured?: boolean;
}

export function ProjectCard({ project, className, featured = false }: ProjectCardProps) {
  const isNew =
    new Date(project.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn("group relative", className)}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300",
          "hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10",
          featured && "border-primary/25"
        )}
      >
        {/* Thumbnail */}
        <div className="relative h-52 overflow-hidden bg-muted">
          {isNextImageSource(project.coverImage) ? (
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
              <span className="text-4xl opacity-30">🖥️</span>
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {project.featured && (
              <Badge variant="featured">
                <Star className="h-3 w-3" />
                Featured
              </Badge>
            )}
            {isNew && <Badge variant="new">New</Badge>}
          </div>

          {/* Quick actions on hover */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition hover:bg-black/90"
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground backdrop-blur-sm transition hover:bg-primary/90"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {project.category && (
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {project.category.name}
            </p>
          )}
          <h3 className="text-lg font-bold leading-snug">{project.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {truncate(project.shortDescription ?? project.description ?? "", 120)}
          </p>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 4).map((tech) => (
                <Badge key={tech.id} variant="outline" className="text-xs">
                  {tech.name}
                </Badge>
              ))}
              {project.technologies.length > 4 && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  +{project.technologies.length - 4}
                </Badge>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {project.viewCount !== undefined && (
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {project.viewCount}
                </span>
              )}
              <span>{formatDate(project.createdAt, { month: "short", year: "numeric", day: undefined })}</span>
            </div>
            <Button asChild size="sm" variant="ghost" className="h-8 text-xs">
              <Link href={`/projects/${project.slug}`}>View details →</Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
