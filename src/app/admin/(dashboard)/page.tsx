"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  FolderKanban, Sparkles, Briefcase, GraduationCap, Award,
  MessageSquareQuote, Mail, ArrowRight, Eye,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { projectService } from "@/services/project.service";
import { skillService } from "@/services/skill.service";
import { experienceService } from "@/services/experience.service";
import { educationService } from "@/services/education.service";
import { certificateService } from "@/services/certificate.service";
import { testimonialService } from "@/services/testimonial.service";
import { contactService } from "@/services/contact.service";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardPage() {
  const projects = useQuery({ queryKey: ["admin", "projects"], queryFn: () => projectService.getAll() });
  const skills = useQuery({ queryKey: ["admin", "skills"], queryFn: skillService.getAll });
  const experiences = useQuery({ queryKey: ["admin", "experiences"], queryFn: experienceService.getAll });
  const education = useQuery({ queryKey: ["admin", "education"], queryFn: educationService.getAll });
  const certificates = useQuery({ queryKey: ["admin", "certificates"], queryFn: certificateService.getAll });
  const pending = useQuery({ queryKey: ["admin", "testimonials", "pending"], queryFn: testimonialService.getPending });
  const messages = useQuery({ queryKey: ["admin", "messages"], queryFn: contactService.getMessages });

  const unreadMessages = (messages.data ?? []).filter((m) => !m.isRead).length;
  const totalViews = (projects.data ?? []).reduce((sum, p) => sum + (p.viewCount ?? 0), 0);

  const cards = [
    { label: "Projects", value: projects.data?.length, icon: FolderKanban, href: "/admin/projects", loading: projects.isLoading },
    { label: "Skills", value: skills.data?.length, icon: Sparkles, href: "/admin/skills", loading: skills.isLoading },
    { label: "Experience", value: experiences.data?.length, icon: Briefcase, href: "/admin/experience", loading: experiences.isLoading },
    { label: "Education", value: education.data?.length, icon: GraduationCap, href: "/admin/education", loading: education.isLoading },
    { label: "Certificates", value: certificates.data?.length, icon: Award, href: "/admin/certificates", loading: certificates.isLoading },
    { label: "Pending Testimonials", value: pending.data?.length, icon: MessageSquareQuote, href: "/admin/testimonials", loading: pending.isLoading, highlight: (pending.data?.length ?? 0) > 0 },
    { label: "Unread Messages", value: unreadMessages, icon: Mail, href: "/admin/messages", loading: messages.isLoading, highlight: unreadMessages > 0 },
    { label: "Total Project Views", value: totalViews, icon: Eye, href: "/admin/projects", loading: projects.isLoading },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your portfolio content and activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group glass rounded-2xl p-5 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    card.highlight
                      ? "bg-amber-500/10 text-amber-500"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="mt-4">
                {card.loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{card.value ?? 0}</p>
                )}
                <p className="mt-1 text-sm text-muted-foreground">{card.label}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
