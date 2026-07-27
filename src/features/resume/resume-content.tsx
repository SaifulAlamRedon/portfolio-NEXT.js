"use client";

import { useState } from "react";
import { Download, Eye, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/common/section-header";
import { FadeIn } from "@/components/animations/fade-in";
import { useSettings } from "@/hooks/use-settings";

export function ResumeContent() {
  const { data: settings } = useSettings();
  const [isLoading, setIsLoading] = useState(false);

  const resumeUrl = settings?.resumeUrl ?? null;

  const handleDownload = () => {
    if (!resumeUrl) return;
    setIsLoading(true);
    const link = document.createElement("a");
    link.href = resumeUrl;
    link.download = `${settings?.siteName ?? "resume"}_Resume.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader
        badge="Resume"
        title="My"
        titleHighlight="Resume"
        description="Download or preview my resume to learn about my experience, skills, and education."
      />

      <div className="flex flex-col items-center gap-6">
        {/* Action buttons */}
        <FadeIn className="flex flex-wrap gap-4 justify-center">
          {resumeUrl && (
            <>
              <Button
                size="lg"
                variant="gradient"
                onClick={handleDownload}
                isLoading={isLoading}
              >
                <Download className="h-5 w-5" />
                Download PDF
              </Button>
              <Button asChild size="lg" variant="glass">
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Eye className="h-5 w-5" />
                  Open in Browser
                </a>
              </Button>
            </>
          )}
        </FadeIn>

        {/* Preview frame or placeholder */}
        <FadeIn className="w-full" delay={0.15}>
          {resumeUrl ? (
            <div className="relative overflow-hidden rounded-3xl border border-border bg-muted shadow-2xl">
              <div className="absolute top-0 left-0 right-0 flex items-center gap-2 border-b border-border bg-card/80 px-4 py-2.5 backdrop-blur-sm">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/70" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/70" />
                </div>
                <span className="text-xs text-muted-foreground truncate">{resumeUrl}</span>
              </div>
              <iframe
                src={resumeUrl}
                title="Resume Preview"
                className="mt-10 h-[800px] w-full"
                aria-label="Resume PDF preview"
              />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-muted/30 py-32 text-center"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Resume Coming Soon</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                The resume hasn&apos;t been uploaded yet. Please check back later or{" "}
                <a href="/contact" className="text-primary hover:underline">
                  get in touch directly
                </a>
                .
              </p>
            </motion.div>
          )}
        </FadeIn>
      </div>
    </div>
  );
}
