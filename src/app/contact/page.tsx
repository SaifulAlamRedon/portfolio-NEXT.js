import type { Metadata } from "next";
import { ContactContent } from "@/features/contact/contact-content";
import { PageTransition } from "@/components/layout/page-transition";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch — I am always open to new opportunities and collaborations.",
};

export default function ContactPage() {
  return (
    <PageTransition>
      <div className="pt-24">
        <ContactContent />
      </div>
    </PageTransition>
  );
}
