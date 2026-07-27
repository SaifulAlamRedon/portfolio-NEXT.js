"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, Code, Trophy, Coffee } from "lucide-react";
import { useExperiences } from "@/hooks/use-experiences";
import { useProjects } from "@/hooks/use-projects";

const stats = [
  { icon: <Briefcase className="h-6 w-6" />, label: "Years Experience", suffix: "+", key: "years" },
  { icon: <Code className="h-6 w-6" />, label: "Projects Completed", suffix: "+", key: "projects" },
  { icon: <Trophy className="h-6 w-6" />, label: "Certificates Earned", suffix: "", key: "certs" },
  { icon: <Coffee className="h-6 w-6" />, label: "Cups of Coffee", suffix: "K+", key: "coffee" },
];

function CountUp({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress >= 1) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}</span>;
}

export function StatisticsSection() {
  const { data: experiences } = useExperiences();
  const { data: projects } = useProjects();

  const yearsExp = experiences?.length
    ? Math.max(
        ...experiences.map((e) => {
          const start = new Date(e.startDate);
          const end = e.endDate ? new Date(e.endDate) : new Date();
          return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365));
        })
      )
    : 5;

  const statValues: Record<string, number> = {
    years: yearsExp,
    projects: projects?.length ?? 50,
    certs: 15,
    coffee: 2,
  };

  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600/10 via-transparent to-cyan-500/10 border border-violet-500/20 p-1">
          <div className="rounded-[1.3rem] bg-card/80 backdrop-blur-xl px-8 py-12">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-cyan-500/20 text-primary">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold sm:text-4xl">
                    <CountUp end={statValues[stat.key]} />
                    {stat.suffix}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
