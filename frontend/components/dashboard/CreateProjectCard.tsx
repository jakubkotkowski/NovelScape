"use client";

import { useState } from "react";
import { Plus, ArrowRight } from "lucide-react";
import { MagicCard } from "@/components/ui/MagicCard";

interface CreateProjectCardProps {
  onCreate: (name: string) => void;
}

export function CreateProjectCard({ onCreate }: Readonly<CreateProjectCardProps>) {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name);
  };

  return (
    <MagicCard
      className="col-span-1 md:col-span-2 h-64"
      gradientFrom="from-indigo-500"
      gradientTo="to-indigo-500 via-purple-500"
    >
      <div className="flex flex-col justify-between h-full">
        {isCreating ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center h-full gap-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Name your project
            </h3>
            
            <input
              autoFocus
              type="text"
              placeholder="e.g., The Martian Chronicles"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-lg text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-sm dark:shadow-none"
            />
            
            <div className="flex gap-3 mt-2">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                Create Project
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-4 py-2.5 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-medium border border-indigo-200 dark:border-indigo-500/20 mb-4 shadow-sm dark:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-colors">
                <Plus size={12} /> New Project
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight transition-colors">
                Start from Scratch
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm leading-relaxed transition-colors">
                Begin a new audio narrative journey. Organize by chapters and scenes.
              </p>
            </div>

            <button
              onClick={() => setIsCreating(true)}
              className="w-fit flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold group-hover:translate-x-2 transition-transform cursor-pointer hover:text-indigo-800 dark:hover:text-indigo-300"
            >
              Create Project <ArrowRight size={18} />
            </button>
          </>
        )}
      </div>
    </MagicCard>
  );
}