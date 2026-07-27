"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter } from "lucide-react";
import { toast } from "sonner";
import { contactSchema, type ContactFormData } from "@/schemas/contact.schema";
import { contactService } from "@/services/contact.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionHeader } from "@/components/common/section-header";
import { FadeIn } from "@/components/animations/fade-in";
import { useSettings } from "@/hooks/use-settings";
import { getSocialLinksFromSettings } from "@/utils";
import { useMutation } from "@tanstack/react-query";

const socialIcons: Record<string, React.ReactNode> = {
  github: <Github className="h-4 w-4" />,
  linkedin: <Linkedin className="h-4 w-4" />,
  twitter: <Twitter className="h-4 w-4" />,
};

export function ContactContent() {
  const { data: settings } = useSettings();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: contactService.send,
    onSuccess: () => {
      toast.success("Message sent! I'll get back to you soon.");
      reset();
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error(message);
    },
  });

  const onSubmit = (data: ContactFormData) => sendMessage(data);

  const socialLinks = Object.entries(getSocialLinksFromSettings(settings)).filter(
    ([k, v]) => k in socialIcons && v
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader
        badge="Contact"
        title="Get In"
        titleHighlight="Touch"
        description="Have a question, an idea, or a project in mind? Send a message and I&apos;ll get back to you."
      />

      <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
        {/* Left — Info */}
        <FadeIn direction="left">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-3">Start a conversation</h2>
              <p className="text-muted-foreground leading-relaxed">
                Whether you want to discuss a project, share an idea, or simply say hello,
                you can reach me through the form or the contact details below.
              </p>
            </div>

            <div className="space-y-4">
              {settings?.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/50 group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500 transition-colors group-hover:bg-violet-500/20">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium">{settings.contactEmail}</p>
                  </div>
                </a>
              )}

              {settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/50 group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500 transition-colors group-hover:bg-cyan-500/20">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">{settings.phone}</p>
                  </div>
                </a>
              )}

              {settings?.address && (
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-500">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium">{settings.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Social */}
            {socialLinks.length > 0 && (
              <div>
                <p className="mb-3 text-sm font-medium text-muted-foreground">Follow me</p>
                <div className="flex gap-3">
                  {socialLinks.map(([key, url]) => (
                    <a
                      key={key}
                      href={url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                    >
                      {socialIcons[key]}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </FadeIn>

        {/* Right — Form */}
        <FadeIn direction="right" delay={0.1}>
          <motion.div className="glass rounded-3xl p-8">
            <h2 className="mb-6 text-xl font-bold">Send a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    {...register("name")}
                    error={errors.name?.message}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...register("email")}
                    error={errors.email?.message}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  placeholder="Project collaboration"
                  {...register("subject")}
                  error={errors.subject?.message}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Tell me about your project, idea, or just say hi..."
                  rows={6}
                  {...register("message")}
                  error={errors.message?.message}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                variant="gradient"
                isLoading={isPending}
                className="w-full"
              >
                <Send className="h-4 w-4" />
                {isPending ? "Sending…" : "Send Message"}
              </Button>
            </form>
          </motion.div>
        </FadeIn>
      </div>
    </div>
  );
}
