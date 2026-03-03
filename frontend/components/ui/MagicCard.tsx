import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MagicCardProps {
  children: ReactNode;
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
  opacity?: string;
}

export function MagicCard({
  children,
  className,
  gradientFrom = "from-indigo-500",
  gradientTo = "to-purple-600",
  opacity = "opacity-20",
}: Readonly<MagicCardProps>) {
  return (
    <div
      className={cn(
        "relative group rounded-2xl bg-white dark:bg-slate-950 p-1 isolate overflow-hidden shadow-sm transition-colors duration-300",
        className,
      )}
    >
      <div
        className={cn(
          "absolute -inset-px rounded-2xl transition-all duration-500 -z-10 bg-linear-to-r blur-[2px]",
          "group-hover:opacity-100 group-hover:blur-md",
          opacity,
          gradientFrom,
          gradientTo,
        )}
      />

      <div className="relative h-full w-full bg-slate-50/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-[14px] overflow-hidden z-10 transition-colors duration-300 border border-slate-200 dark:border-white/10">
        <div className="h-full w-full p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}