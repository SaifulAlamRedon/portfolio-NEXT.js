"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Award, ExternalLink, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils";
import type { Certificate } from "@/types";

interface CertificateCardProps {
  certificate: Certificate;
  index?: number;
}

export function CertificateCard({ certificate, index = 0 }: CertificateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/10">
        {/* Image */}
        {certificate.image ? (
          <div className="relative h-44 overflow-hidden bg-muted">
            <Image
              src={certificate.image}
              alt={certificate.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="flex h-44 items-center justify-center bg-gradient-to-br from-amber-500/10 to-orange-500/10">
            <Award className="h-16 w-16 text-amber-500/40" />
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold leading-snug">{certificate.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{certificate.issuer}</p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>Issued {formatDate(certificate.issueDate, { month: "short", year: "numeric" })}</span>
          </div>

          {certificate.credentialUrl && (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="mt-4 w-full text-xs"
            >
              <a href={certificate.credentialUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                Verify Credential
              </a>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
