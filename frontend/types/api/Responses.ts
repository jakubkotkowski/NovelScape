export interface AnalyzeResponse {
  scene_prompt: string;
  music_prompt: string;
  sfx_prompts: string[];
  meta: { mood: string };
}

export interface AudioGenResponse {
  files: string[];
}

export interface SingleUrlResponse {
  url: string;
}