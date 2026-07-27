import { HeroSection } from "@/components/sections/hero";
import { TechMarquee } from "@/components/sections/tech-marquee";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { ExperienceTimeline } from "@/components/sections/experience-timeline";
import { SkillsOverview } from "@/components/sections/skills-overview";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { ContactCTA } from "@/components/sections/contact-cta";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TechMarquee />
      <FeaturedProjects />
      <SkillsOverview />
      <ExperienceTimeline />
      <TestimonialsSection />
      <ContactCTA />
    </>
  );
}
