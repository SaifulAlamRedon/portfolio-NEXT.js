import type { Metadata } from "next";
import { CertificatesContent } from "@/features/certificates/certificates-content";
import { PageTransition } from "@/components/layout/page-transition";

export const metadata: Metadata = {
  title: "Certificates",
  description: "Professional certifications and credentials I have earned.",
};

export default function CertificatesPage() {
  return (
    <PageTransition>
      <div className="pt-24">
        <CertificatesContent />
      </div>
    </PageTransition>
  );
}
