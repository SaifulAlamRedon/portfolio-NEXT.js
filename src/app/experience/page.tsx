import type { Metadata } from "next";
import { ExperienceContent } from "@/features/experience/experience-content";
import { PageTransition } from "@/components/layout/page-transition";

export const metadata: Metadata = {
  title: "Experience",
  description: "My professional journey and work history.",
};

export default function ExperiencePage() {
  return (
    <PageTransition>
      <div className="pt-24">
        <ExperienceContent />
      </div>
    </PageTransition>
  );
}
