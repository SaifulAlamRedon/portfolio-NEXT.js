import { cn } from "@/utils";
import { FadeIn } from "@/components/animations/fade-in";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  titleHighlight?: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  badge,
  title,
  titleHighlight,
  description,
  centered = true,
  className,
}: SectionHeaderProps) {
  return (
    <FadeIn className={cn("mb-16", centered && "text-center", className)}>
      {badge && (
        <div className={cn("mb-4", centered && "flex justify-center")}>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
            {badge}
          </span>
        </div>
      )}
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        {title}{" "}
        {titleHighlight && <span className="text-gradient">{titleHighlight}</span>}
      </h2>
      {description && (
        <p className={cn("mt-4 text-lg text-muted-foreground max-w-2xl", centered && "mx-auto")}>
          {description}
        </p>
      )}
    </FadeIn>
  );
}
