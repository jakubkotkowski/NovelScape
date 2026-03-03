"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Header } from "@/components/layout/Header";
import { NarrativeEditor } from "@/components/editor/NarrativeEditor";
import { AssetPanel } from "@/components/editor/asset-panel/AssetPanel";
import { useNarrativeContext, useAssetContext } from "@/context/EditorContext";
import { storage } from "@/lib/storage";
import { useAssetExport } from "@/hooks/useAssetExport";

export default function ChapterEditorPage({
  params,
}: Readonly<{
  params: Promise<{ projectId: string; chapterId: string }>;
}>) {
  const narrative = useNarrativeContext();
  const { sfx, image, music, mixer } = useAssetContext();
  const { exportAssets, isExportingAssets } = useAssetExport();

  const [projectTitle, setProjectTitle] = useState("Loading...");
  const [chapterTitle, setChapterTitle] = useState("Loading...");
  const [ids, setIds] = useState<{
    projectId: string;
    chapterId: string;
  } | null>(null);
  useEffect(() => {
    params.then((p) => {
      setIds(p);
      const project = storage.getProject(p.projectId);

      if (project) {
        setProjectTitle(project.title);
        const chapter = project.chapters.find((c) => c.id === p.chapterId);

        if (chapter) {
          setChapterTitle(chapter.title);
          narrative.actions.hydrate(chapter.content, {
            sfxPrompts: chapter.prompts,
            visualPrompt: chapter.visualPrompt,
            musicPrompt: chapter.musicPrompt,
            mood: chapter.mood,
          });
          if (chapter.backgroundImage) {
            image.setBackgroundImage(chapter.backgroundImage);
          }
          sfx.setTracks(chapter.sfxTracks || []);
          music.setTracks(chapter.musicTracks || []);
          if (chapter.finalMixUrl && mixer.setFinalMixUrl) {
            mixer.setFinalMixUrl(chapter.finalMixUrl);
          }
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // Auto-Save
  useEffect(() => {
    if (!ids) return;

    const timer = setTimeout(() => {
      console.log("Auto-saving chapter...");
      storage.saveChapter(ids.projectId, ids.chapterId, {
        content: narrative.content.text,
        prompts: narrative.analysis.sfxPrompts,
        visualPrompt: narrative.analysis.visualPrompt,
        musicPrompt: narrative.analysis.musicPrompt,
        mood: narrative.analysis.mood,
        backgroundImage: image.backgroundImage || undefined,
        sfxTracks: sfx.tracks,
        musicTracks: music.tracks,
        finalMixUrl: mixer.finalMixUrl || undefined,
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    narrative.content.text,
    narrative.analysis,
    image.backgroundImage,
    sfx.tracks,
    music.tracks,
    mixer.finalMixUrl,
    ids,
  ]);

  const handleExportAssets = () => {
    exportAssets(
      projectTitle,
      chapterTitle,
      image.backgroundImage ?? undefined,
      mixer.finalMixUrl ?? undefined,
      sfx.tracks,
      music.tracks,
    );
  };

  return (
    <PageShell className="h-screen flex flex-col overflow-hidden transition-colors duration-300">
      <Header
        projectName={projectTitle || "Loading..."}
        chapterInfo={chapterTitle || "Loading..."}
        onExportVideo={handleExportAssets}
        isExportingVideo={isExportingAssets}
      />
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 relative min-w-0">
          <NarrativeEditor />
        </div>
        <div className="w-[35%] min-w-87.5 max-w-125 z-20">
          <AssetPanel />
        </div>
      </div>
    </PageShell>
  );
}