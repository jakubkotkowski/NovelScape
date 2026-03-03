export type ThemeCategory =
  | "music"
  | "sfx"
  | "visual"
  | "primary"
  | "destructive";

export const TRACK_PLAYER_THEMES: Record<ThemeCategory, any> = {
  music: {
    btn: "bg-fuchsia-600 dark:bg-fuchsia-500 text-white shadow-fuchsia-500/25 hover:bg-fuchsia-700 dark:hover:bg-fuchsia-400",
    bar: "bg-fuchsia-500/50",
    icon: "text-slate-500 dark:text-slate-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400",
    container:
      "bg-white dark:bg-fuchsia-950/20 border-slate-200 dark:border-fuchsia-500/30 hover:bg-slate-50 dark:hover:bg-fuchsia-900/20",
    text: "text-slate-700 dark:text-fuchsia-200/70",
  },
  sfx: {
    btn: "bg-emerald-600 dark:bg-emerald-500 text-white shadow-emerald-500/25 hover:bg-emerald-700 dark:hover:bg-emerald-400",
    bar: "bg-emerald-500/50",
    icon: "text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400",
    container:
      "bg-white dark:bg-emerald-950/20 border-slate-200 dark:border-emerald-500/30 hover:bg-slate-50 dark:hover:bg-emerald-900/20",
    text: "text-slate-700 dark:text-emerald-200/70",
  },
  visual: {
    btn: "bg-indigo-600 dark:bg-indigo-500 text-white shadow-indigo-900/20 hover:bg-indigo-700 dark:hover:bg-indigo-400",
    bar: "bg-indigo-500",
    icon: "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400",
    container:
      "bg-white dark:bg-indigo-950/20 border-slate-200 dark:border-indigo-500/30 hover:bg-slate-50 dark:hover:bg-indigo-900/20",
    text: "text-slate-700 dark:text-indigo-200/70",
  },
  primary: {
    btn: "bg-indigo-600 dark:bg-indigo-500 text-white shadow-indigo-900/20 hover:bg-indigo-700 dark:hover:bg-indigo-400",
    bar: "bg-indigo-500",
    icon: "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400",
    container:
      "bg-white dark:bg-slate-900/40 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10",
    text: "text-slate-700 dark:text-slate-300",
  },
  destructive: {
    btn: "bg-rose-600 dark:bg-rose-500 text-white shadow-rose-900/20 hover:bg-rose-700 dark:hover:bg-rose-400",
    bar: "bg-rose-500",
    icon: "text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400",
    container:
      "bg-white dark:bg-rose-950/20 border-rose-200 dark:border-rose-500/30",
    text: "text-rose-700 dark:text-rose-200",
  },
};

export const SLIDER_THEMES: Record<ThemeCategory, any> = {
  music: {
    text: "text-fuchsia-600 dark:text-fuchsia-400",
    badge:
      "text-fuchsia-700 dark:text-fuchsia-300 bg-fuchsia-100 dark:bg-fuchsia-500/10 border-fuchsia-200 dark:border-fuchsia-500/20",
    accent:
      "accent-fuchsia-600 dark:accent-fuchsia-500 focus:ring-fuchsia-500/30",
  },
  sfx: {
    text: "text-emerald-600 dark:text-emerald-400",
    badge:
      "text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20",
    accent:
      "accent-emerald-600 dark:accent-emerald-500 focus:ring-emerald-500/30",
  },
  visual: {
    text: "text-indigo-600 dark:text-indigo-400",
    badge:
      "text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20",
    accent: "accent-indigo-600 dark:accent-indigo-500 focus:ring-indigo-500/30",
  },
  primary: {
    text: "text-indigo-600 dark:text-indigo-400",
    badge:
      "text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20",
    accent: "accent-indigo-600 dark:accent-indigo-500 focus:ring-indigo-500/30",
  },
  destructive: {
    text: "text-rose-600 dark:text-rose-400",
    badge:
      "text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20",
    accent: "accent-rose-600 dark:accent-rose-500 focus:ring-rose-500/30",
  },
};

export const DROPZONE_THEMES: Record<ThemeCategory, string> = {
  music:
    "border-fuchsia-300 dark:border-fuchsia-500/30 bg-fuchsia-50 dark:bg-fuchsia-500/5 text-fuchsia-600 dark:text-fuchsia-400 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-500/10 hover:border-fuchsia-400 dark:hover:border-fuchsia-500/50",
  sfx: "border-emerald-300 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/10 hover:border-emerald-400 dark:hover:border-emerald-500/50",
  visual:
    "border-indigo-300 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/10 hover:border-indigo-400 dark:hover:border-indigo-500/50",
  primary:
    "border-indigo-300 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/10 hover:border-indigo-400 dark:hover:border-indigo-500/50",
  destructive:
    "border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/5 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/10 hover:border-rose-400 dark:hover:border-rose-500/50",
};

export const BADGE_THEMES: Record<ThemeCategory, string> = {
  music:
    "text-fuchsia-700 dark:text-fuchsia-400 bg-fuchsia-100 dark:bg-fuchsia-500/10 border-fuchsia-200 dark:border-fuchsia-500/20",
  sfx: "text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20",
  visual:
    "text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20",
  primary:
    "text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20",
  destructive:
    "text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20",
};

export type ThemeColor = ThemeCategory;
export type SliderColor = ThemeCategory;

export const getStatusStyle = (
  type: ThemeCategory | "script" | "analysis" | "visual" | "audio",
  active: boolean,
) => {
  if (!active)
    return "text-slate-400 dark:text-slate-600 opacity-60 dark:opacity-40 grayscale hover:opacity-100 hover:grayscale-0";
  switch (type) {
    case "audio":
      return "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20";
    case "visual":
      return "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/20";
    case "script":
      return "bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-500/20";
    case "analysis":
      return "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/20";
    default:
      return "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300";
  }
};

export const COLORS = {
  glass:
    "bg-white/60 dark:bg-slate-950/60 backdrop-blur-md border border-slate-200 dark:border-white/10",
  inactive:
    "text-slate-400 dark:text-slate-600 opacity-60 dark:opacity-40 grayscale hover:opacity-100 hover:grayscale-0",
};
