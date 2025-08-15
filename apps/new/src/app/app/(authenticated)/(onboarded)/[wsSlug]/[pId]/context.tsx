"use client";

import type { GetProject } from "@mapform/backend/data/projects/get-project";
import { createContext, useContext } from "react";
import {
  type StateServiceProps,
  useStateService,
} from "~/lib/use-state-service";
import { updateProjectAction } from "~/data/projects/update-project";
import type { UpdateProjectSchema } from "@mapform/backend/data/projects/update-project/schema";
import type { GetPlaceDetails } from "@mapform/backend/data/geoapify/details";

export interface ProjectContextProps {
  activeView?: NonNullable<GetProject["data"]>["views"][number];
  geoapifyPlaceDetails?: GetPlaceDetails["data"];
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
      console.log("state", state);
      console.log("newProject", newProject);
      console.log("merged", {
        ...state,
        ...newProject,
      });
      return {
        ...state,
        ...newProject,
      };
    },
  });

  console.log("projectService", projectService.optimisticState);

  // const featureService = useStateService<GetRow["data"], UpdateRowSchema>(
  //   updateRowAction,
  //   {
  //     currentState: feature,
  //     updateFn: (state, newRow) => {
  //       if (!state) return state;
  //       return {
  //         ...state,
  //         ...newRow,
  //       };
  //     },
  //   },
  // );

  // const features = project.rows.map((row) => {
  //   if (row.id === feature?.id) {
  //     return {
  //       ...row,
  //       ...featureService.optimisticState,
  //     };
  //   }
  //   return row;
  // });

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
