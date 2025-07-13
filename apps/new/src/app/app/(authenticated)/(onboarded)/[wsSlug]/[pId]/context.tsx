"use client";

import type { GetProject } from "@mapform/backend/data/projects/get-project";
import type { GetRow } from "@mapform/backend/data/rows/get-row";
import { createContext, useContext, useEffect } from "react";
import {
  type StateServiceProps,
  useStateService,
} from "~/lib/use-state-service";
import { updateRowAction } from "~/data/rows/update-row";
import type { UpdateRowSchema } from "@mapform/backend/data/rows/update-row/schema";
import { updateProjectAction } from "~/data/projects/update-project";
import type { UpdateProjectSchema } from "@mapform/backend/data/projects/update-project/schema";
import type { GetPlaceDetails } from "@mapform/backend/data/geoapify/details";
import { useMap } from "react-map-gl/mapbox";

export interface ProjectContextProps {
  features: NonNullable<GetProject["data"]>["rows"];
  activeView?: NonNullable<GetProject["data"]>["views"][number];
  geoapifyPlaceDetails?: GetPlaceDetails["data"];
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
}: {
  feature?: GetRow["data"];
  project: NonNullable<GetProject["data"]>;
  activeView?: NonNullable<GetProject["data"]>["views"][number];
  children: React.ReactNode;
}) {
  const map = useMap();

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

  /**
   * Fly to the project center on mount
   */
  useEffect(() => {
    map.current?.flyTo({
      center: project.center.coordinates,
      duration: 1000,
    });
  }, [project, map]);

  return (
    <ProjectContext.Provider
      value={{
        features,
        activeView,
        featureService,
        projectService,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
