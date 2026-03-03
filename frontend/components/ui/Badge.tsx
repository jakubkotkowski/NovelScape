import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BADGE_THEMES, ThemeCategory } from "@/styles/themes";

interface BadgeProps {
  children: ReactNode;
  color?: ThemeCategory | "slate";
  className?: string;
}

export function Badge({ children, color = "primary", className }: Readonly<BadgeProps>) {
  
  const themeClass = BADGE_THEMES[color as ThemeCategory] || BADGE_THEMES.primary;

  return (
    <span
      className={cn(
        "text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider",
        themeClass,
        className
      )}
    >
      {children}
    </span>
  );
}