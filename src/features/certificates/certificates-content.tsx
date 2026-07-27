"use client";

import { SectionHeader } from "@/components/common/section-header";
import { CertificateCard } from "@/components/cards/certificate-card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { Stagger, StaggerItem } from "@/components/animations/fade-in";
import { useCertificates } from "@/hooks/use-experiences";

export function CertificatesContent() {
  const { data: certificates, isLoading } = useCertificates();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader
        badge="Credentials"
        title="My"
        titleHighlight="Certificates"
        description="Courses and certifications I have completed as part of ongoing learning."
      />

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border overflow-hidden">
              <Skeleton className="h-44 rounded-none" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : !certificates?.length ? (
        <EmptyState title="No certificates yet" description="Certificates will appear here once added." />
      ) : (
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {certificates.map((cert, i) => (
            <StaggerItem key={cert.id}>
              <CertificateCard certificate={cert} index={i} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
