import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const BASE_URL = process.env.BASE_API_URL

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAudioUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}