import { PageShell } from "@/components/layout/PageShell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageShell className="flex flex-col overflow-auto h-screen custom-scrollbar">

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12">
        {children}
      </main>
    </PageShell>
  );
}