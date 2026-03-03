"use client";

import { EditorProvider } from "@/context/EditorContext";
import { ReactNode } from "react";

export default function ChapterEditorLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <EditorProvider>{children}</EditorProvider>;
}
