import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { AudioTrack } from "@/types/AudioTrack";

export function useAssetExport() {
  const [isExportingAssets, setIsExportingAssets] = useState(false);

  const exportAssets = async (
    projectName: string,
    chapterName: string,
    imageUrl?: string,
    mixUrl?: string,
    sfxTracks: AudioTrack[] = [],
    musicTracks: AudioTrack[] = []
  ) => {
    setIsExportingAssets(true);
    try {
      const zip = new JSZip();
      
      const cleanProject = projectName.replace(/[^a-z0-9_-]/gi, "_");
      const cleanChapter = chapterName.replace(/[^a-z0-9_-]/gi, "_");
      const folderName = `${cleanProject}_${cleanChapter}`;
      
      const rootFolder = zip.folder(folderName);
      if (!rootFolder) throw new Error("Could not create zip folder.");

      const addFileToZip = async (folder: JSZip, url: string, filename: string) => {
        const response = await fetch(url);
        const blob = await response.blob();
        folder.file(filename, blob);
      };

      if (imageUrl) {
        const ext = imageUrl.split(".").pop() || "png";
        await addFileToZip(rootFolder, imageUrl, `Background.${ext}`);
      }

      if (mixUrl) {
        await addFileToZip(rootFolder, mixUrl, `Final_Mix.wav`);
      }

      if (sfxTracks.length > 0) {
        const sfxFolder = rootFolder.folder("SFX_Stems");
        if (sfxFolder) {
          await Promise.all(
            sfxTracks.map((track, i) => addFileToZip(sfxFolder, track.url, `SFX_Track_${i + 1}.wav`))
          );
        }
      }

      if (musicTracks.length > 0) {
        const musicFolder = rootFolder.folder("Music_Stems");
        if (musicFolder) {
          await Promise.all(
            musicTracks.map((track, i) => addFileToZip(musicFolder, track.url, `Music_Track_${i + 1}.wav`))
          );
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${folderName}.zip`);

    } catch (error) {
      console.error("Failed to zip assets:", error);
      alert("Failed to export assets. Check the console for details.");
    } finally {
      setIsExportingAssets(false);
    }
  };

  return { exportAssets, isExportingAssets };
}