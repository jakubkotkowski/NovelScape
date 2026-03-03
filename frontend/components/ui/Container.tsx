import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Container({ children, className, ...props }: Readonly<ContainerProps>) {
  return (
    <div
      className={cn(
        // standard layout for most of the page 
        "relative z-10 max-w-6xl mx-auto px-6 py-12 flex flex-col",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}