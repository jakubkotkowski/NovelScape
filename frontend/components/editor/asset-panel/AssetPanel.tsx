"use client";

import { useState } from "react";
import {
  Image as ImageIcon,
  Music,
  Layers,
  SlidersHorizontal,
  Sparkles,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNarrativeContext } from "@/context/EditorContext";
import { VisualsTab } from "./tabs/VisualsTab";
import { MusicTab } from "./tabs/MusicTab";
import { SfxTab } from "./tabs/SfxTab";
import { MixerTab } from "./tabs/MixerTab";

type TabType = "visual" | "music" | "sfx" | "mix";

export function AssetPanel({ className }: Readonly<{ className?: string }>) {
  const [activeTab, setActiveTab] = useState<TabType>("visual");
  const narrative = useNarrativeContext();

  const handleAnalyze = async () => {
    if (!narrative.content.text) return;
    await narrative.actions.analyze();
  };

  const isStale = narrative.content.isStale;
  const hasPrompts = narrative.analysis.sfxPrompts.length > 0;
  const isUpToDate = hasPrompts && !isStale;

  let buttonContent = (
    <>
      <Sparkles size={16} />
      {hasPrompts ? "Update Analysis" : "Extract Scene Prompts"}
    </>
  );

  if (narrative.content.isAnalyzing) {
    buttonContent = (
      <>
        <RefreshCw size={16} className="animate-spin" />
        Reading Narrative...
      </>
    );
  } else if (isUpToDate) {
    buttonContent = (
      <>
        <CheckCircle2
          size={16}
          className="text-emerald-600 dark:text-emerald-500"
        />
        <span className="text-slate-600 dark:text-slate-400">
          Analysis Up to Date
        </span>
      </>
    );
  }

  return (
    <aside
      className={cn(
        "w-full flex flex-col h-full bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-white/10 shadow-[-5px_0_15px_rgba(0,0,0,0.05)] dark:shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-20 transition-colors duration-300",
        className,
      )}
    >
      <div className="flex border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50 shrink-0 transition-colors duration-300">
        <TabButton
          isActive={activeTab === "visual"}
          onClick={() => setActiveTab("visual")}
          icon={<ImageIcon size={14} />}
          label="Visuals"
          activeColor="text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-500/20"
          borderColor="border-indigo-500"
        />
        <TabButton
          isActive={activeTab === "music"}
          onClick={() => setActiveTab("music")}
          icon={<Music size={14} />}
          label="Music"
          activeColor="text-fuchsia-700 dark:text-fuchsia-400 bg-fuchsia-100 dark:bg-fuchsia-500/20"
          borderColor="border-fuchsia-500"
        />
        <TabButton
          isActive={activeTab === "sfx"}
          onClick={() => setActiveTab("sfx")}
          icon={<Layers size={14} />}
          label="SFX"
          activeColor="text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20"
          borderColor="border-emerald-500"
        />
        <TabButton
          isActive={activeTab === "mix"}
          onClick={() => setActiveTab("mix")}
          icon={<SlidersHorizontal size={14} />}
          label="Mix"
          activeColor="text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-700/50"
          borderColor="border-slate-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/30 transition-colors duration-300">
        {activeTab === "visual" && <VisualsTab />}
        {activeTab === "music" && <MusicTab />}
        {activeTab === "sfx" && <SfxTab />}
        {activeTab === "mix" && <MixerTab />}
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-white/5 relative z-30 shrink-0 transition-colors duration-300">
        <button
          onClick={handleAnalyze}
          disabled={
            narrative.content.isAnalyzing ||
            !narrative.content.text ||
            isUpToDate
          }
          className={cn(
            "w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md dark:shadow-lg text-sm relative overflow-hidden group",
            isStale && hasPrompts
              ? "bg-amber-500 hover:bg-amber-400 dark:bg-amber-600 dark:hover:bg-amber-500 text-white"
              : "bg-indigo-600 hover:bg-indigo-500 text-white",
            "disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed disabled:opacity-100",
          )}
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-150%] group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />
          {buttonContent}
        </button>
      </div>
    </aside>
  );
}

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  activeColor: string;
  borderColor: string;
}

function TabButton({
  isActive,
  onClick,
  icon,
  label,
  activeColor,
  borderColor,
}: Readonly<TabButtonProps>) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 py-4 text-xs font-bold transition-all flex flex-col justify-center items-center gap-2 border-b-2 relative",
        isActive
          ? `text-slate-900 dark:text-white bg-white dark:bg-slate-900 ${borderColor}`
          : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/30 border-transparent",
      )}
    >
      <div
        className={cn(
          "p-1.5 rounded-md transition-colors duration-300",
          isActive ? activeColor : "",
        )}
      >
        {icon}
      </div>
      <span className="uppercase tracking-wider text-[10px]">{label}</span>
    </button>
  );
}
