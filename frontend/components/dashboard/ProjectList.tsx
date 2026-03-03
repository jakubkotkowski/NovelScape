import Link from "next/link";
import { Folder, MoreHorizontal, Clock } from "lucide-react";
import { Project } from "@/types/Project";

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: Readonly<ProjectListProps>) {
  return (
    <div className="flex-1">
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2 mb-6 transition-colors">
        <Clock size={18} className="text-slate-500 dark:text-slate-400" /> Your Projects
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="group relative bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-300 dark:hover:border-white/10 transition-all cursor-pointer shadow-sm dark:shadow-none"
          >
            <div className="flex justify-between items-start mb-10">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all">
                <Folder size={18} />
              </div>
              <MoreHorizontal size={18} className="text-slate-400 dark:text-slate-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-200 text-lg mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-200 transition-colors">
                {project.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">
                {project.chapters.length} Chapters
              </p>
            </div>
          </Link>
        ))}

        {projects.length === 0 && (
          <div className="col-span-3 text-center py-10 text-slate-500 dark:text-slate-600 text-sm transition-colors">
            No projects found. Create one above!
          </div>
        )}
      </div>
    </div>
  );
}