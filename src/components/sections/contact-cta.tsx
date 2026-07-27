"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/use-settings";
import { FadeIn } from "@/components/animations/fade-in";

export function ContactCTA() {
  const { data: settings } = useSettings();

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn>
          <div className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Mail className="h-3.5 w-3.5" />
              Get in touch
            </span>
          </div>

          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Let&apos;s build something{" "}
            <span className="text-gradient">amazing together</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Have a project, question, or collaboration in mind? I&apos;d be happy to hear from you.
            {settings?.contactEmail && (
              <> Reach me at{" "}
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="text-primary hover:underline"
                >
                  {settings.contactEmail}
                </a>
              </>
            )}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button asChild size="xl" variant="gradient">
                <Link href="/contact">
                  Start a Conversation
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button asChild size="xl" variant="glass">
                <Link href="/resume">View Resume</Link>
              </Button>
            </motion.div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
