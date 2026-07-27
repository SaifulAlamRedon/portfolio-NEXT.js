"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Mail, Github, Linkedin, Twitter, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/common/section-header";
import { FadeIn, Stagger, StaggerItem } from "@/components/animations/fade-in";
import { useSettings } from "@/hooks/use-settings";
import { useSkills } from "@/hooks/use-skills";
import { useEducation } from "@/hooks/use-experiences";
import { getInitials, getSocialLinksFromSettings, unique } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";

const socialIcons: Record<string, React.ReactNode> = {
  github: <Github className="h-4 w-4" />,
  linkedin: <Linkedin className="h-4 w-4" />,
  twitter: <Twitter className="h-4 w-4" />,
};

export function AboutContent() {
  // NOTE: this used to read from /users/profile, but that endpoint requires
  // an admin JWT on the backend — a public page can never call it
  // successfully. Public "about me" info lives on /settings instead
  // (siteName, aboutMe, logo, contactEmail, github/linkedIn/twitter).
  const { data: settings, isLoading } = useSettings();
  const { data: skills } = useSkills();
  const { data: education } = useEducation();

  const topTechs = unique((skills ?? []).map((s) => s.name)).slice(0, 12);
  const socialLinks = Object.entries(getSocialLinksFromSettings(settings)).filter(
    ([k, v]) => k in socialIcons && v
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader
        badge="About"
        title="Who I"
        titleHighlight="Am"
        description="A little more context about my background, current focus, and the work I enjoy doing."
      />

      <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
        {/* Left — Avatar & quick info */}
        <FadeIn direction="left">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* Avatar */}
            <div className="relative mb-8">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-violet-600/20 to-cyan-500/20 blur-xl" />
              <div className="relative h-64 w-64 overflow-hidden rounded-3xl border border-white/10 bg-muted">
                {isLoading ? (
                  <Skeleton className="h-full w-full rounded-3xl" />
                ) : settings?.logo ? (
                  <Image
                    src={settings.logo}
                    alt={settings.siteName ?? "Profile"}
                    fill
                    className="object-cover"
                    sizes="256px"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-5xl font-bold text-gradient">
                    {getInitials(settings?.siteName ?? "P")}
                  </div>
                )}
              </div>
            </div>

            {/* Name & role */}
            {isLoading ? (
              <div className="space-y-2 w-48">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4 mx-auto lg:mx-0" />
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold">{settings?.siteName ?? "Portfolio"}</h1>
                <p className="mt-1 text-muted-foreground">Full-Stack Developer</p>
              </>
            )}

            {/* Location */}
            {settings?.address && (
              <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {settings.address}
              </div>
            )}

            {/* Social links */}
            {(socialLinks.length > 0 || settings?.contactEmail) && (
              <div className="mt-6 flex gap-3">
                {socialLinks.map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    {socialIcons[key]}
                  </a>
                ))}
                {settings?.contactEmail && (
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}

            <Button asChild className="mt-6" variant="gradient">
              <Link href="/contact">
                <Mail className="h-4 w-4" />
                Get In Touch
              </Link>
            </Button>
          </div>
        </FadeIn>

        {/* Right — Bio, Tech, Education */}
        <FadeIn direction="right" delay={0.1}>
          <div className="space-y-10">
            {/* Bio */}
            {(isLoading || settings?.aboutMe) && (
              <div>
                <h2 className="mb-4 text-xl font-bold">About Me</h2>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                ) : (
                  <p className="leading-relaxed text-muted-foreground">{settings?.aboutMe}</p>
                )}
              </div>
            )}

            {/* Technologies */}
            {topTechs.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-bold">Technologies</h2>
                <Stagger className="flex flex-wrap gap-2">
                  {topTechs.map((tech) => (
                    <StaggerItem key={tech}>
                      <Badge variant="gradient" className="text-sm px-3 py-1">
                        {tech}
                      </Badge>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            )}

            {/* Education highlights */}
            {education && education.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-bold">Education</h2>
                <div className="space-y-4">
                  {education.slice(0, 2).map((edu) => (
                    <motion.div
                      key={edu.id}
                      className="glass rounded-2xl p-5"
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold">{edu.degree}</h3>
                          <p className="text-sm text-primary">{edu.institution}</p>
                          {edu.fieldOfStudy && (
                            <p className="text-xs text-muted-foreground">{edu.fieldOfStudy}</p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {edu.startYear}
                          {edu.endYear ? ` — ${edu.endYear}` : " — Present"}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {education.length > 2 && (
                  <Button asChild variant="ghost" size="sm" className="mt-3">
                    <Link href="/education">
                      View all education <ExternalLink className="h-3 w-3" />
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
