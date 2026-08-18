"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Linkedin, Twitter, Mail, Phone, ExternalLink, Copy, Check } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { NAV_LINKS } from "@/constants";
import { copyToClipboard, getSocialLinksFromSettings } from "@/utils";
import { useState } from "react";
import { toast } from "sonner";

const socialIcons: Record<string, React.ReactNode> = {
  github: <Github className="h-4 w-4" />,
  linkedin: <Linkedin className="h-4 w-4" />,
  twitter: <Twitter className="h-4 w-4" />,
};

export function Footer() {
  const pathname = usePathname();
  const { data: settings } = useSettings();
  const [copied, setCopied] = useState(false);
  const currentYear = new Date().getFullYear();

  // Hide footer on admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const handleCopyEmail = async () => {
    if (!settings?.contactEmail) return;
    const ok = await copyToClipboard(settings.contactEmail);
    if (ok) {
      setCopied(true);
      toast.success("Email copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const socialLinks = getSocialLinksFromSettings(settings);
  const displayedSocials = Object.entries(socialLinks).filter(([k]) => k in socialIcons);

  return (
    <footer className="relative border-t border-border">
      {/* Gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary p-px shadow-lg shadow-primary/20">
                <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-background text-xs font-bold text-gradient">
                  {settings?.siteName?.charAt(0) ?? "P"}
                </div>
              </div>
              <span className="font-bold">{settings?.siteName ?? "Portfolio"}</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
              {settings?.aboutMe
                ? settings.aboutMe.slice(0, 140) + (settings.aboutMe.length > 140 ? "…" : "")
                : "Building exceptional digital experiences with modern technologies."}
            </p>
            {/* Social links */}
            {displayedSocials.length > 0 && (
              <div className="mt-6 flex items-center gap-3">
                {displayedSocials.map(([key, url]) => (
                  <a
                    key={key}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-muted/50 text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                    aria-label={key}
                  >
                    {socialIcons[key]}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Nav links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Navigation
            </h3>
            <ul className="space-y-3">
              {NAV_LINKS.slice(0, 6).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Contact
            </h3>
            <ul className="space-y-3">
              {settings?.contactEmail && (
                <li>
                  <button
                    onClick={handleCopyEmail}
                    className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate max-w-[160px]">{settings.contactEmail}</span>
                    {copied ? (
                      <Check className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <Copy className="h-3 w-3 opacity-50" />
                    )}
                  </button>
                </li>
              )}
              {settings?.phone && (
                <li>
                  <a
                    href={`tel:${settings.phone}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Phone className="h-4 w-4 shrink-0" />
                    {settings.phone}
                  </a>
                </li>
              )}
              <li>
                <Link
                  href="/contact"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Send a message
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            {`© ${currentYear} ${settings?.siteName ?? "Portfolio"}. All rights reserved.`}
          </p>
          <p className="text-xs text-muted-foreground/60">
            Built with Next.js 15 · TypeScript · Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
