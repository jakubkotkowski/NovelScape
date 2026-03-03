"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/storage";
import { Project } from "@/types/Project";
import { CreateProjectCard } from "@/components/dashboard/CreateProjectCard";
import { ProjectList } from "@/components/dashboard/ProjectList";
import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/ui/Container";
import { GradientTitle } from "@/components/ui/GradientTitle";

export default function Dashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(storage.getProjects());
  }, []);

  const handleCreateProject = (name: string) => {
    const project = storage.createProject(name);
    router.push(`/projects/${project.id}`);
  };

  return (
    <PageShell> 
      <Container>
        <div className="mb-16">
          <GradientTitle>
            What will you create today?
          </GradientTitle>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CreateProjectCard onCreate={handleCreateProject} />
          </div>
        </div>

        <ProjectList projects={projects} />
      </Container>
    </PageShell>
  );
}