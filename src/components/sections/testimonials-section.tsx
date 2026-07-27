"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/common/section-header";
import { useTestimonials } from "@/hooks/use-experiences";
import { getInitials } from "@/utils";

export function TestimonialsSection() {
  const { data: testimonials } = useTestimonials();
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const items = testimonials ?? [];

  useEffect(() => {
    if (!autoPlay || items.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoPlay, items.length]);

  if (!items.length) return null;

  const prev = () => {
    setAutoPlay(false);
    setCurrent((c) => (c - 1 + items.length) % items.length);
  };
  const next = () => {
    setAutoPlay(false);
    setCurrent((c) => (c + 1) % items.length);
  };

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/10" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Testimonials"
          title="Words From"
          titleHighlight="Others"
          description="Feedback shared by people who have worked with me."
        />

        <div className="relative mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="glass rounded-3xl p-8 sm:p-12 text-center"
            >
              {/* Quote icon */}
              <Quote className="mx-auto mb-6 h-10 w-10 text-primary/40" />

              {/* Stars */}
              {items[current].rating && (
                <div className="mb-6 flex justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < (items[current].rating ?? 0)
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Content */}
              <p className="text-lg leading-relaxed text-foreground sm:text-xl">
                &ldquo;{items[current].message}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-8 flex items-center justify-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-primary/30">
                  {items[current].photo ? (
                    <Image
                      src={items[current].photo}
                      alt={items[current].name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary text-sm font-bold text-primary-foreground">
                      {getInitials(items[current].name)}
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <p className="font-semibold">{items[current].name}</p>
                  <p className="text-sm text-muted-foreground">
                    {items[current].designation}
                    {items[current].company && ` @ ${items[current].company}`}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {items.length > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={prev}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex gap-2">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setAutoPlay(false); setCurrent(i); }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === current ? "w-6 bg-primary" : "w-2 bg-border"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
