"use client";

import type { GetProject } from "@mapform/backend/data/projects/get-project";
import type { GetRow } from "@mapform/backend/data/rows/get-row";
import { notFound } from "next/navigation";
import { createContext, useContext, useTransition } from "react";
import { projectSearchParams, projectSearchParamsUrlKeys } from "./params";
import { useQueryStates } from "nuqs";

export interface ProjectContextProps {
  feature?: GetRow["data"];
  project: NonNullable<GetProject["data"]>;
  activeView?: NonNullable<GetProject["data"]>["views"][number];
  isFeaturePending: boolean;
  setSelectedFeature: (featureId: string | null) => void;
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
  const [isFeaturePending, startTransition] = useTransition();

  const [_, setProjectSearchParams] = useQueryStates(projectSearchParams, {
    urlKeys: projectSearchParamsUrlKeys,
    shallow: false,
  });

  const setSelectedFeature = (featureId: string | null) => {
    // Ignore if the feature is the same as the current selected feature
    if (feature?.id === featureId) {
      return;
    }

    if (featureId) {
      startTransition(() => {
        void setProjectSearchParams(
          {
            rowId: featureId,
          },
          {
            shallow: false,
          },
        );
      });
    }

    // If null don't worry about transition
    void setProjectSearchParams(
      {
        rowId: featureId,
      },
      {
        shallow: false,
      },
    );
  };

  if (!project) {
    notFound();
  }

  return (
    <ProjectContext.Provider
      value={{
        project,
        feature,
        activeView,
        isFeaturePending,
        setSelectedFeature,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
