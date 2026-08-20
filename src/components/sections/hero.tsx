"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, Download, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypingAnimation } from "@/components/animations/typing-animation";
import { useSettings } from "@/hooks/use-settings";
import { getInitials, getSocialLinksFromSettings } from "@/utils";

const TYPING_WORDS = [
  "Web Developer",
  "Problem Solver",
  "Building for People",
  "Always Learning",
];

const socialMap: Record<string, { icon: React.ReactNode; label: string }> = {
  github: { icon: <Github className="h-4 w-4" />, label: "GitHub" },
  linkedin: { icon: <Linkedin className="h-4 w-4" />, label: "LinkedIn" },
  twitter: { icon: <Twitter className="h-4 w-4" />, label: "Twitter" },
  email: { icon: <Mail className="h-4 w-4" />, label: "Email" },
};

export function HeroSection() {
  // NOTE: was previously calling /users/profile (useProfile), which the
  // backend guards with JwtAuthGuard — a visitor without a login token
  // would always get a 401 here. Settings is the public equivalent.
  const { data: settings } = useSettings();

  const fullName = settings?.siteName ?? "Your Name";
  const displayName = fullName.split(" ")[0];

  const socialLinksMap = getSocialLinksFromSettings(settings);
  const socialLinks = Object.entries({
    ...socialLinksMap,
    ...(settings?.contactEmail ? { email: `mailto:${settings.contactEmail}` } : {}),
  }).filter(([k]) => k in socialMap);

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center pt-20">
      {/* Animated aurora background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="animate-aurora absolute left-[-20%] top-[-30%] h-[80vh] w-[80vh] rounded-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent blur-3xl" />
        <div
          className="animate-aurora absolute right-[-15%] bottom-[-20%] h-[70vh] w-[70vh] rounded-full bg-gradient-to-tl from-secondary/10 via-primary/5 to-transparent blur-3xl"
          style={{ animationDelay: "4s", animationDuration: "14s" }}
        />
        <div
          className="animate-aurora absolute right-[20%] top-[10%] h-[50vh] w-[50vh] rounded-full bg-gradient-to-br from-fuchsia-600/15 to-transparent blur-3xl"
          style={{ animationDelay: "8s", animationDuration: "18s" }}
        />
      </div>

      {/* Content */}
      <div className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left: text */}
          <div>
            {/* Available badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Personal portfolio
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl font-bold leading-[1.06] tracking-[-0.055em] sm:text-6xl lg:text-8xl"
            >
              Hi, I&apos;m<br />
              <span className="bg-clip-text bg-gradient-to-r from-primary via-accent to-primary text-transparent animate-gradient-shift">{displayName}</span>
            </motion.h1>

            {/* Typing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-2xl font-semibold leading-relaxed sm:text-3xl"
            >
              <span className="bg-clip-text bg-gradient-to-r from-primary to-accent text-transparent">
                <TypingAnimation
                  words={TYPING_WORDS}
                  className=""
                />
              </span>
            </motion.div>

            {/* Bio */}
            {settings?.aboutMe && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 max-w-lg text-lg text-muted-foreground leading-relaxed sm:text-xl"
              >
                {settings?.aboutMe}
              </motion.p>
            )}

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex flex-wrap gap-4 sm:gap-5"
            >
              <Button asChild size="lg" variant="gradient" className="gap-2 px-8 h-12 text-base font-medium shadow-xl hover:shadow-2xl transition-all duration-300">
                <Link href="/projects">
                  <Mail className="h-5 w-5" />
                  View Projects
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/[0.05] hover:bg-white/[0.08] h-12 text-base font-medium px-8">
                <Link href="/resume">
                  <Download className="h-5 w-5" />
                  View Resume
                </Link>
              </Button>
            </motion.div>

            {/* Social links */}
            {socialLinks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-10 flex items-center gap-5"
              >
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Follow me:</span>
                <div className="flex items-center gap-3">
                  {socialLinks.map(([key, url]) => {
                    const social = socialMap[key];
                    if (!social) return null;
                    return (
                      <motion.a
                        key={key}
                        href={url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-accent/10 text-primary transition-all duration-300 hover:border-primary/60 hover:shadow-[0_0_20px_rgba(255,186,32,0.3)]"
                        aria-label={social.label}
                      >
                        {social.icon}
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Profile avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="absolute -inset-8 rounded-full bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 blur-3xl animate-pulse-glow" />
              <motion.div
                className="absolute -inset-4 rounded-full border-2 border-dashed border-primary/40"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute -inset-2 rounded-full border border-primary/25"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              <div className="relative h-72 w-72 overflow-hidden rounded-full border-4 border-primary/80 bg-card shadow-[0_0_0_16px_rgb(255_186_32_/_0.12),0_0_60px_rgb(255_186_32_/_0.2),0_32px_120px_rgb(0_0_0_/_0.4)] sm:h-80 sm:w-80 lg:h-96 lg:w-96">
                {settings?.logo ? (
                  <Image
                    src={settings.logo}
                    alt={fullName}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="384px"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 text-6xl font-bold text-gradient">
                    {getInitials(fullName)}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-sm text-muted-foreground font-medium">Scroll to explore</span>
          <motion.div
            className="h-8 w-5 rounded-full border-2 border-muted-foreground/50 flex items-start justify-center pt-2"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <motion.div
              className="h-1.5 w-1 rounded-full bg-gradient-to-b from-primary to-accent"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
