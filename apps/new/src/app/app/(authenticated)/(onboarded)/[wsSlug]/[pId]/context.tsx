"use client";

import type { GetProject } from "@mapform/backend/data/projects/get-project";
import type { GetRow } from "@mapform/backend/data/rows/get-row";
import { createContext, useContext } from "react";
import type { SearchPlaces } from "@mapform/backend/data/geoapify/search";
import type { SearchRows } from "@mapform/backend/data/rows/search-rows";
import {
  type StateServiceProps,
  useStateService,
} from "~/lib/use-state-service";
import { updateRowAction } from "~/data/rows/update-row";
import type { UpdateRowSchema } from "@mapform/backend/data/rows/update-row/schema";
import { updateProjectAction } from "~/data/projects/update-project";
import type { UpdateProjectSchema } from "@mapform/backend/data/projects/update-project/schema";

export interface ProjectContextProps {
  features: NonNullable<GetProject["data"]>["rows"];
  activeView?: NonNullable<GetProject["data"]>["views"][number];
  vectorSearchResults?: SearchRows["data"];
  geoapifySearchResults?: SearchPlaces["data"];
  featureService: StateServiceProps<
    GetRow["data"] | undefined,
    UpdateRowSchema
  >;
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
  feature,
  project,
  activeView,
  vectorSearchResults,
  geoapifySearchResults,
}: {
  feature?: GetRow["data"];
  project: NonNullable<GetProject["data"]>;
  activeView?: NonNullable<GetProject["data"]>["views"][number];
  vectorSearchResults?: SearchRows["data"];
  geoapifySearchResults?: SearchPlaces["data"];
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
      };
    },
  });

  const featureService = useStateService<GetRow["data"], UpdateRowSchema>(
    updateRowAction,
    {
      currentState: feature,
      updateFn: (state, newRow) => {
        if (!state) return state;
        return {
          ...state,
          ...newRow,
        };
      },
    },
  );

  const features = project.rows.map((row) => {
    if (row.id === feature?.id) {
      return {
        ...row,
        ...featureService.optimisticState,
      };
    }
    return row;
  });

  return (
    <ProjectContext.Provider
      value={{
        features,
        activeView,
        vectorSearchResults,
        geoapifySearchResults,
        featureService,
        projectService,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
