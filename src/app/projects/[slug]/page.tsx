import type { Metadata } from "next";
import { ProjectDetail } from "@/features/projects/project-detail";
import { PageTransition } from "@/components/layout/page-transition";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    description: "Detailed breakdown of this project — problem, solution, tech stack, and lessons learned.",
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  return (
    <PageTransition>
      <div className="pt-24">
        <ProjectDetail slug={slug} />
      </div>
    </PageTransition>
  );
}
