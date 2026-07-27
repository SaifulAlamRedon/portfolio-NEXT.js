import type { Metadata } from "next";
import { ProjectsContent } from "@/features/projects/projects-content";
import { PageTransition } from "@/components/layout/page-transition";

export const metadata: Metadata = {
  title: "Projects",
  description: "A collection of projects I have built — from side projects to production apps.",
};

export default function ProjectsPage() {
  return (
    <PageTransition>
      <div className="pt-24">
        <ProjectsContent />
      </div>
    </PageTransition>
  );
}
