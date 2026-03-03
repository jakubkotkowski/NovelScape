import Link from "next/link";
import Image from "next/image";
import {
  Image as ImageIcon,
  Music,
  Sparkles,
  Plus,
  Clock,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { Chapter } from "@/types/Chapter";
import { MagicCard } from "@/components/ui/MagicCard";
import { cn } from "@/lib/utils";

interface ChapterGridProps {
  projectId: string;
  chapters: Chapter[];
  onCreateNew: () => void;
}

export function ChapterGrid({
  projectId,
  chapters,
  onCreateNew,
}: Readonly<ChapterGridProps>) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
      <button
        onClick={onCreateNew}
        className="group relative h-64 rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/10 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300 flex flex-col items-center justify-center gap-4 overflow-hidden"
      >
        <div className="absolute inset-0 bg-slate-900/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] opacity-20 dark:opacity-40" />

        <div className="relative p-5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 group-hover:border-indigo-500/50 group-hover:scale-110 transition-all duration-300 shadow-sm dark:shadow-xl z-10">
          <Plus
            size={32}
            className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
          />
        </div>
        <div className="relative z-10 text-center">
          <span className="block text-sm font-bold text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 uppercase tracking-widest transition-colors">
            New Chapter
          </span>
        </div>
      </button>

      {chapters.map((chapter, index) => {
        const hasVisual = !!chapter.backgroundImage;

        const hasSfx = chapter.sfxTracks && chapter.sfxTracks.length > 0;
        const hasMusic = chapter.musicTracks && chapter.musicTracks.length > 0;
        const hasMix = hasSfx || hasMusic;

        return (
          <Link
            key={chapter.id}
            href={`/projects/${projectId}/${chapter.id}`}
            className="group block h-64 relative"
          >
            <MagicCard
              className="h-full overflow-hidden p-0"
              gradientFrom={hasVisual ? "from-indigo-500" : "from-slate-400 dark:from-slate-600"}
              gradientTo={hasVisual ? "to-fuchsia-500" : "to-slate-300 dark:to-slate-700"}
              opacity="opacity-0"
            >
              <div className="absolute inset-0 z-0 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
                {hasVisual && chapter.backgroundImage ? (
                  <>
                    <Image
                      src={chapter.backgroundImage}
                      alt={chapter.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-30 dark:opacity-60 group-hover:opacity-50 dark:group-hover:opacity-80"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-white via-white/80 dark:from-slate-950 dark:via-slate-950/60 to-transparent transition-colors duration-300" />
                  </>
                ) : (
                  <div className="absolute inset-0 opacity-40 dark:opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-200 via-slate-100 to-white dark:from-indigo-500 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300" />
                )}
              </div>

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div
                    className="px-3 py-1 rounded-full flex items-center gap-2 shadow-sm dark:shadow-lg bg-white/60 dark:bg-slate-950/60 backdrop-blur-md border border-slate-200 dark:border-white/10 transition-colors"
                  >
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-300 uppercase tracking-widest">
                      CH.{String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-slate-900 dark:text-white">
                    <ChevronRight size={20} />
                  </div>
                </div>

                <div className="mt-auto mb-4">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-200 transition-colors drop-shadow-sm dark:drop-shadow-lg">
                    {chapter.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-slate-500 dark:text-slate-400 text-[10px] font-mono transition-colors">
                    <Clock size={10} />
                    <span>
                      {new Date(chapter.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div
                  className="rounded-xl p-1 flex items-center justify-between gap-1 shadow-sm dark:shadow-lg bg-white/60 dark:bg-slate-950/60 backdrop-blur-md border border-slate-200 dark:border-white/10 transition-colors"
                >
                  <StatusIcon
                    active={hasVisual}
                    icon={<ImageIcon size={12} />}
                    label="IMG"
                    type="visual"
                  />
                  <div className="w-px h-3 bg-slate-300 dark:bg-white/10 transition-colors" />

                  <StatusIcon
                    active={hasSfx}
                    icon={<Sparkles size={12} />}
                    label="SFX"
                    type="audio"
                  />
                  <div className="w-px h-3 bg-slate-300 dark:bg-white/10 transition-colors" />

                  <StatusIcon
                    active={hasMusic}
                    icon={<Music size={12} />}
                    label="MUS"
                    type="analysis"
                  />
                  <div className="w-px h-3 bg-slate-300 dark:bg-white/10 transition-colors" />

                  <StatusIcon
                    active={hasMix}
                    icon={<SlidersHorizontal size={12} />}
                    label="MIX"
                    type="script"
                  />
                </div>
              </div>
            </MagicCard>
          </Link>
        );
      })}
    </div>
  );
}

interface StatusIconProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  type: "script" | "analysis" | "visual" | "audio";
}

function StatusIcon({ active, icon, label, type }: StatusIconProps) {
  let activeStyles = "";
  if (active) {
    switch (type) {
      case "audio": activeStyles = "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20"; break;
      case "visual": activeStyles = "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/20"; break;
      case "script": activeStyles = "bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-500/20"; break;
      case "analysis": activeStyles = "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/20"; break;
    }
  } else {
    activeStyles = "text-slate-400 dark:text-slate-600 opacity-60 dark:opacity-40 grayscale hover:opacity-100 hover:grayscale-0";
  }

  return (
    <div
      className={cn(
        "flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-lg transition-all duration-500 border border-transparent",
        activeStyles,
      )}
    >
      {icon}
      <span className="text-[8px] font-bold tracking-wider">{label}</span>
    </div>
  );
}