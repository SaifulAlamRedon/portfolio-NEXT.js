"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { getSkillLevelLabel, getSkillLevelColor, cn } from "@/utils";
import type { Skill } from "@/types";

interface SkillCardProps {
  skill: Skill;
  index?: number;
}

export function SkillCard({ skill, index = 0 }: SkillCardProps) {
  const isValidImageSrc = (src?: string) =>
    Boolean(src && /^(?:https?:\/\/|\/|data:)/.test(src));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="group glass rounded-2xl p-5 transition-all hover:border-primary/40"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {isValidImageSrc(skill.icon) ? (
            <div className="relative h-10 w-10 overflow-hidden rounded-xl">
              <Image src={skill.icon!} alt={skill.name} fill className="object-contain" sizes="40px" />
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg">
              💡
            </div>
          )}
          <div>
            <h4 className="font-semibold text-sm">{skill.name}</h4>
            <span className={cn("text-xs font-medium", getSkillLevelColor(skill.percentage))}>
              {getSkillLevelLabel(skill.percentage)}
            </span>
          </div>
        </div>
        <span className="text-sm font-bold text-muted-foreground">{skill.percentage}%</span>
      </div>

      {/* Progress bar */}
      <div className="relative h-1.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-primary"
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 + index * 0.03, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}
