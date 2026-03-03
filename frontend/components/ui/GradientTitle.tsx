import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GradientTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export function GradientTitle({
  children,
  className,
  ...props
}: Readonly<GradientTitleProps>) {
  return (
    <h1
      className={cn(
        "text-4xl md:text-5xl font-bold mb-6 transition-colors duration-300",
        "bg-clip-text text-transparent bg-linear-to-r",
        "from-slate-900 via-indigo-600 to-slate-700",
        "dark:from-slate-100 dark:via-indigo-200 dark:to-slate-400",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}