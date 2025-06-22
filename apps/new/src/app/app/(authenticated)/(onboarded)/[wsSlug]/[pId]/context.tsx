"use client";

import type { GetProject } from "@mapform/backend/data/projects/get-project";
import type { GetRow } from "@mapform/backend/data/rows/get-row";
import { notFound } from "next/navigation";
import { createContext, useContext } from "react";

export interface ProjectContextProps {
  feature?: GetRow["data"];
  project: NonNullable<GetProject["data"]>;
  activeView?: NonNullable<GetProject["data"]>["views"][number];
}

export const ProjectContext = createContext<ProjectContextProps>(
  {} as ProjectContextProps,
);
export const useProject = () => useContext(ProjectContext);

export function ProjectProvider({
  children,
  feature,
  project,
  activeView,
}: {
  feature?: GetRow["data"];
  project: GetProject["data"];
  activeView?: NonNullable<GetProject["data"]>["views"][number];
  children: React.ReactNode;
}) {
  if (!project) {
    notFound();
  }

  return (
    <ProjectContext.Provider value={{ project, feature, activeView }}>
      {children}
    </ProjectContext.Provider>
  );
}
