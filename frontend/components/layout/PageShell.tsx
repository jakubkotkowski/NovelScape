import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageShellProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function PageShell({ children, className, ...props }: PageShellProps) {
  return (
    <div
      className={cn(
        "bg-background text-foreground font-sans selection:bg-indigo-500/30",
        "min-h-screen w-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
