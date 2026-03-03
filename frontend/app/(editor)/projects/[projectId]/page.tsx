"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Layers, Calendar, Plus, Settings } from "lucide-react";
import { storage } from "@/lib/storage";
import { Project } from "@/types/Project";
import { Header } from "@/components/layout/Header";
import { ChapterGrid } from "@/components/project/ChapterGrid";
import { Container } from "@/components/ui/Container";
import { GradientTitle } from "@/components/ui/GradientTitle";
import { Badge } from "@/components/ui/Badge";
import { ActionButton } from "@/components/ui/ActionButton";
import { MagicCard } from "@/components/ui/MagicCard";

export default function ProjectOverview({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    params.then((p) => {
      const data = storage.getProject(p.projectId);
      if (data) setProject(data);
    });
  }, [params]);

  const handleCreateChapter = () => {
    if (!project) return;
    const title = `Chapter ${project.chapters.length + 1}`;
    const newChapter = storage.createChapter(project.id, title);
    if (newChapter) {
      router.push(`/projects/${project.id}/${newChapter.id}`);
    }
  };

  if (!project) return null;

  const lastUpdated = new Date(
    project.chapters[project.chapters.length - 1]?.updatedAt ||
      project.createdAt,
  ).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    // Explicit white/slate backgrounds
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans selection:bg-indigo-500/30 relative transition-colors duration-300">
      <div className="relative z-10">
        <Header projectName={project.title} chapterInfo="Overview" />
        <Container className="pt-10 pb-24">
          <div className="flex justify-between items-start mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <Link
              href="/"
              className="group flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest"
            >
              <ArrowLeft
                size={14}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back to Dashboard
            </Link>

            <button className="text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              <Settings size={20} />
            </button>
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <div className="space-y-4 max-w-2xl">
              <GradientTitle className="mb-2">{project.title}</GradientTitle>

              <div className="flex items-center gap-3">
                <Badge color="indigo" className="py-1 px-3 text-xs">
                  <Layers size={12} className="inline mr-1.5" />
                  {project.chapters.length} Chapters
                </Badge>
                <Badge color="slate" className="py-1 px-3 text-xs">
                  <Calendar size={12} className="inline mr-1.5" />
                  Updated {lastUpdated}
                </Badge>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-lg transition-colors">
                Manage your narrative arcs, generate audio assets, and visualize
                your scenes. Select a chapter below to enter the editor.
              </p>
            </div>
            <MagicCard
              className="w-full md:w-auto min-w-[300px]"
              gradientFrom="from-indigo-500/20"
              gradientTo="to-fuchsia-500/20"
            >
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">
                  Quick Actions
                </span>
                <ActionButton
                  onClick={handleCreateChapter}
                  icon={<Plus size={18} />}
                >
                  Create New Chapter
                </ActionButton>
                <div className="text-[10px] text-center text-slate-500 dark:text-slate-400">
                  Next: Chapter {project.chapters.length + 1}
                </div>
              </div>
            </MagicCard>
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-300 dark:via-white/10 to-transparent transition-colors" />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Chapter List
              </span>
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-300 dark:via-white/10 to-transparent transition-colors" />
            </div>

            <ChapterGrid
              projectId={project.id}
              chapters={project.chapters}
              onCreateNew={handleCreateChapter}
            />
          </div>
        </Container>
      </div>
    </div>
  );
}