import type { Metadata } from "next";
import { SkillsContent } from "@/features/skills/skills-content";
import { PageTransition } from "@/components/layout/page-transition";

export const metadata: Metadata = {
  title: "Skills",
  description: "Technologies, tools and frameworks I work with.",
};

export default function SkillsPage() {
  return (
    <PageTransition>
      <div className="pt-24">
        <SkillsContent />
      </div>
    </PageTransition>
  );
}
