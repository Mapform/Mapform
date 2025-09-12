"use client";

import type { GetProject } from "@mapform/backend/data/projects/get-project";
import { createContext, useContext } from "react";
import {
  type StateServiceProps,
  useStateService,
} from "~/lib/use-state-service";
import { updateProjectAction } from "~/data/projects/update-project";
import type { UpdateProjectSchema } from "@mapform/backend/data/projects/update-project/schema";
import type { Details } from "@mapform/backend/data/stadia/details";

export interface ProjectContextProps {
  activeView?: NonNullable<GetProject["data"]>["views"][number];
  details?: Details["data"];
  projectService: StateServiceProps<
    NonNullable<GetProject["data"]>,
    UpdateProjectSchema
  >;
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
  project: NonNullable<GetProject["data"]>;
  activeView?: NonNullable<GetProject["data"]>["views"][number];
  children: React.ReactNode;
}) {
  const projectService = useStateService<
    NonNullable<GetProject["data"]>,
    UpdateProjectSchema
  >(updateProjectAction, {
    currentState: project,
    updateFn: (state, newProject) => {
      return {
        ...state,
        ...newProject,
        center: newProject.center
          ? { type: "Point", coordinates: newProject.center.coordinates }
          : state.center,
      };
    },
  });

  return (
    <ProjectContext.Provider
      value={{
        activeView,
        projectService,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
