import type { Metadata } from "next";
import { AboutContent } from "@/features/about/about-content";
import { PageTransition } from "@/components/layout/page-transition";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about me — my background, skills, and what drives me.",
};

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="pt-24">
        <AboutContent />
      </div>
    </PageTransition>
  );
}
