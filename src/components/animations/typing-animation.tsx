"use client";

import { useTyping } from "@/hooks/use-typing";

interface TypingAnimationProps {
  words: string[];
  className?: string;
  cursorClassName?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export function TypingAnimation({
  words,
  className,
  cursorClassName,
  typingSpeed,
  deletingSpeed,
  pauseDuration,
}: TypingAnimationProps) {
  const { displayText } = useTyping({ words, typingSpeed, deletingSpeed, pauseDuration });

  return (
    <span className={className}>
      {displayText}
      <span
        className={cursorClassName ?? "ml-0.5 inline-block h-[1em] w-0.5 animate-pulse bg-current align-middle"}
        aria-hidden="true"
      />
    </span>
  );
}
