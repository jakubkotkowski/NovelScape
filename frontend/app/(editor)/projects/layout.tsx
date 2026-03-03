import { PageShell } from "@/components/layout/PageShell";

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageShell className="h-screen overflow-hidden flex flex-col">
      {children}
    </PageShell>
  );
}