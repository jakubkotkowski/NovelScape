import { Chapter } from "./Chapter";

export interface Project {
  id: string;
  title: string;
  createdAt: string;
  chapters: Chapter[];
}