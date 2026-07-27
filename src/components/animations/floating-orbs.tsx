"use client";

import { motion } from "framer-motion";

interface FloatingOrbsProps {
  count?: number;
}

const orbs = [
  { color: "from-violet-600/20 to-purple-600/5", size: "w-96 h-96", x: "10%", y: "5%", delay: 0 },
  { color: "from-cyan-500/15 to-blue-500/5", size: "w-80 h-80", x: "75%", y: "60%", delay: 2 },
  { color: "from-fuchsia-500/10 to-pink-500/5", size: "w-72 h-72", x: "60%", y: "10%", delay: 4 },
  { color: "from-indigo-600/10 to-violet-600/5", size: "w-64 h-64", x: "20%", y: "70%", delay: 1 },
  { color: "from-teal-500/10 to-cyan-500/5", size: "w-56 h-56", x: "85%", y: "20%", delay: 3 },
];

export function FloatingOrbs({ count = 5 }: FloatingOrbsProps) {
  const displayed = orbs.slice(0, Math.min(count, orbs.length));

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {displayed.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-gradient-to-br ${orb.color} ${orb.size} blur-3xl`}
          style={{ left: orb.x, top: orb.y }}
          animate={{
            x: [0, 30, -20, 10, 0],
            y: [0, -20, 30, -10, 0],
            scale: [1, 1.05, 0.97, 1.03, 1],
          }}
          transition={{
            duration: 16 + i * 4,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function PageOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute left-1/4 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-br from-violet-600/20 to-transparent blur-3xl" />
      <div className="absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-500/15 to-transparent blur-3xl" />
    </div>
  );
}
