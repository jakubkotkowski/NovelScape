import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  color?: "indigo" | "fuchsia" | "emerald" | "slate";
  icon?: ReactNode;
}

export function ActionButton({
  children,
  color = "indigo",
  icon,
  className,
  ...props
}: Readonly<ActionButtonProps>) {
  const styles = {
    indigo:
      "bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 shadow-indigo-500/20 text-white",
    fuchsia:
      "bg-fuchsia-600 hover:bg-fuchsia-700 dark:hover:bg-fuchsia-500 shadow-fuchsia-500/20 text-white",
    emerald:
      "bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500 shadow-emerald-500/20 text-white",
    slate:
      "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm dark:shadow-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5",
  };

  return (
    <button
      className={cn(
        "w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm dark:shadow-lg text-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        styles[color],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
