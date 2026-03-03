import {
  AnalyzePayload,
  GenerateMusicPayload,
  GenerateSfxPayload,
  GenerateImagePayload,
  MixPayload,
  ExportVideoPayload,
} from "@/types/api/Payloads";
import {
  AnalyzeResponse,
  AudioGenResponse,
  SingleUrlResponse,
} from "@/types/api/Responses";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const headers = { ...options.headers } as Record<string, string>;
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail);
  }
  return res.json();
}

export const api = {
  narrative: {
    analyze: (payload: AnalyzePayload) =>
      request<AnalyzeResponse>("/analyze", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },
  assets: {
    generateMusic: (payload: GenerateMusicPayload) =>
      request<SingleUrlResponse>("/generate-music", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    generateSfx: (payload: GenerateSfxPayload) =>
      request<AudioGenResponse>("/generate-audio", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    generateImage: (payload: GenerateImagePayload) =>
      request<SingleUrlResponse>("/generate-image", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },

  mixer: {
    exportMix: (payload: MixPayload) =>
      request<SingleUrlResponse>("/mix", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    exportVideo: (payload: ExportVideoPayload) =>
      request<SingleUrlResponse>("/export-video", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },
  uploads: {
    uploadFile: (file: File, category: "music" | "sfx") => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      return request<SingleUrlResponse>("/upload", {
        method: "POST",
        body: formData,
      });
    },
  },
};
