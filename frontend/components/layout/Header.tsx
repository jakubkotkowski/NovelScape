import { BookOpen, Download, Film, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface HeaderProps {
  projectName?: string;
  chapterInfo?: string;
  onExportAssets?: () => void;
  onExportVideo?: () => void;
  isExportingVideo?: boolean;
}

export function Header({
  projectName = "Project: The Last Rain",
  chapterInfo = "CH.01 // DRAFT",
  onExportAssets,
  onExportVideo,
  isExportingVideo = false,
}: Readonly<HeaderProps>) {
  return (
    <header className="h-16 shrink-0 border-wh border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/40 backdrop-blur-md flex items-center px-6 justify-between z-20 relative transition-colors duration-300">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-300 shadow-sm dark:shadow-[0_0_10px_rgba(99,102,241,0.15)] transition-colors">
          <BookOpen size={18} />
        </div>
        <div>
          <h1 className="font-bold text-sm text-slate-900 dark:text-slate-100 tracking-wide drop-shadow-sm transition-colors">
            {projectName}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono transition-colors">
            {chapterInfo}
          </p>
        </div>
      </div>

      {/* Action Section */}
      <div className="flex items-center gap-3">
        {/* Standard Assets Export */}
        {onExportAssets && (
          <button
            onClick={onExportAssets}
            className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 px-4 py-2 rounded transition backdrop-blur-sm"
          >
            <Download size={14} />
            Assets
          </button>
        )}

        {onExportVideo && (
          <button
            onClick={onExportVideo}
            disabled={isExportingVideo}
            className="flex items-center gap-2 text-xs font-bold text-white bg-fuchsia-600 hover:bg-fuchsia-500 shadow-sm dark:shadow-[0_0_15px_rgba(217,70,239,0.3)] disabled:opacity-50 disabled:grayscale px-4 py-2 rounded transition"
          >
            {isExportingVideo ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Film size={14} />
            )}
            {isExportingVideo ? "Rendering..." : "Export Assets"}
          </button>
        )}

        <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1 transition-colors" />
        <ThemeToggle />
      </div>
    </header>
  );
}
