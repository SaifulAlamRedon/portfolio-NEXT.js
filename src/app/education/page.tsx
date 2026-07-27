import type { Metadata } from "next";
import { EducationContent } from "@/features/education/education-content";
import { PageTransition } from "@/components/layout/page-transition";

export const metadata: Metadata = {
  title: "Education",
  description: "My academic background and formal education.",
};

export default function EducationPage() {
  return (
    <PageTransition>
      <div className="pt-24">
        <EducationContent />
      </div>
    </PageTransition>
  );
}
