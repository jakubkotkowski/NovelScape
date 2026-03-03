import { Chapter } from "@/types/Chapter";
import { Project } from "@/types/Project";

const STORAGE_KEY = "audioweaver_projects";

export const storage = {
  getProjects: (): Project[] => {
    if (typeof globalThis.window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to load projects", e);
      return [];
    }
  },

  createProject: (title: string): Project => {
    const projects = storage.getProjects();
    const newProject: Project = {
      id: crypto.randomUUID(),
      title,
      createdAt: new Date().toISOString(),
      chapters: [],
    };

    // Save to local storage
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([newProject, ...projects])
    );
    return newProject;
  },

  getProject: (id: string): Project | undefined => {
    return storage.getProjects().find((p) => p.id === id);
  },

  createChapter: (projectId: string, title: string): Chapter | null => {
    const projects = storage.getProjects();
    const projectIndex = projects.findIndex((p) => p.id === projectId);

    if (projectIndex === -1) return null;

    const newChapter: Chapter = {
      id: crypto.randomUUID(),
      title,
      content: "",
      prompts: [],
      sfxTracks: [],
      musicTracks: [],
      updatedAt: new Date().toISOString(),
    };

    projects[projectIndex].chapters.push(newChapter);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));

    return newChapter;
  },

  saveChapter: (
    projectId: string,
    chapterId: string,
    data: Partial<Chapter>
  ) => {
    const projects = storage.getProjects();
    const pIdx = projects.findIndex((p) => p.id === projectId);

    if (pIdx === -1) return;

    const cIdx = projects[pIdx].chapters.findIndex((c) => c.id === chapterId);

    if (cIdx === -1) return;
    projects[pIdx].chapters[cIdx] = {
      ...projects[pIdx].chapters[cIdx],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  },

  deleteChapter: (projectId: string, chapterId: string) => {
    const projects = storage.getProjects();
    const pIdx = projects.findIndex((p) => p.id === projectId);
    if (pIdx === -1) return;

    projects[pIdx].chapters = projects[pIdx].chapters.filter(
      (c) => c.id !== chapterId
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  },
};
