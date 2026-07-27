import type { Metadata } from "next";
import { ResumeContent } from "@/features/resume/resume-content";
import { PageTransition } from "@/components/layout/page-transition";

export const metadata: Metadata = {
  title: "Resume",
  description: "Download or preview my resume.",
};

export default function ResumePage() {
  return (
    <PageTransition>
      <div className="pt-24">
        <ResumeContent />
      </div>
    </PageTransition>
  );
}
