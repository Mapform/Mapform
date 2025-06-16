"use client";

import type { GetProject } from "@mapform/backend/data/projects/get-project";
import { notFound } from "next/navigation";
import { createContext, useContext } from "react";

export interface ProjectContextProps {
  project: NonNullable<GetProject["data"]>;
  activeView?: NonNullable<GetProject["data"]>["views"][number];
}

export const ProjectContext = createContext<ProjectContextProps>(
  {} as ProjectContextProps,
);
export const useProject = () => useContext(ProjectContext);

export function ProjectProvider({
  children,
  project,
  activeView,
}: {
  project: GetProject["data"];
  activeView?: NonNullable<GetProject["data"]>["views"][number];
  children: React.ReactNode;
}) {
  if (!project) {
    notFound();
  }

  return (
    <ProjectContext.Provider value={{ project, activeView }}>
      {children}
    </ProjectContext.Provider>
  );
}
