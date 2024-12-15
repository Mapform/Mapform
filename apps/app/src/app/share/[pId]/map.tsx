"use client";

import { MapForm, useMapform } from "@mapform/mapform";
import { useAction } from "next-safe-action/hooks";
import React, { useEffect, useState } from "react";
import type { PageData } from "@mapform/backend/data/datalayer/get-page-data";
import type { GetLayerPoint } from "@mapform/backend/data/datalayer/get-layer-point";
import { type GetLayerMarker } from "@mapform/backend/data/datalayer/get-layer-marker";
import type { ProjectWithPages } from "@mapform/backend/data/projects/get-project-with-pages";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import type { Responses } from "@mapform/backend/data/rows/get-responses";
import { env } from "~/env.mjs";
import { createSubmissionAction } from "~/data/rows/create-submission";
import { submitPageAction } from "./actions";

interface MapProps {
  pageData: PageData | undefined;
  projectWithPages: ProjectWithPages;
  formValues: NonNullable<NonNullable<Responses>["data"]>["cells"];
  selectedFeature?: GetLayerPoint | GetLayerMarker;
  sessionId: string | null;
  isUsingSessions: boolean;
}

type Page = NonNullable<ProjectWithPages["data"]>["pages"][number];

export function Map({
  pageData,
  sessionId,
  formValues,
  isUsingSessions,
  projectWithPages,
  selectedFeature,
}: MapProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const p = searchParams.get("p");
  const currentPage = projectWithPages.data?.pages.find(
    (page) => page.id === p,
  );
  const setCurrentPage = (page: Page) => {
    router.replace(`${pathname}?p=${page.id}`);
  };

  const { map } = useMapform();

  const [currentSession, setCurrentSession] = useState<string | null>(null);

  const { execute } = useAction(submitPageAction);

  const setCurrentPageAndFly = (page: Page) => {
    setCurrentPage(page);
    map?.flyTo({
      center: [page.center.x, page.center.y],
      zoom: page.zoom,
      pitch: page.pitch,
      bearing: page.bearing,
      duration: 1000,
    });
  };

  useEffect(() => {
    void (async () => {
      let newSessionId = sessionId;

      // If we don't have a submissionsDataset, we are not create sessions
      if (!isUsingSessions) {
        return;
      }

      if (!newSessionId) {
        const response = await createSubmissionAction({
          projectId: projectWithPages.id,
        });

        if (response?.data) {
          newSessionId = response.data;
        }
      }
      setCurrentSession(newSessionId);
    })();
  }, [projectWithPages, sessionId, isUsingSessions]);

  /**
   * Fix the 'p' query param if no valid page
   */
  useEffect(() => {
    if (projectWithPages.pages[0] && (!p || !currentPage)) {
      const firstStep = projectWithPages.pages[0];

      router.replace(`${pathname}?p=${projectWithPages.pages[0].id}`);

      map?.flyTo({
        center: [firstStep.center.x, firstStep.center.y],
        zoom: firstStep.zoom,
        pitch: firstStep.pitch,
        bearing: firstStep.bearing,
        duration: 1000,
      });
    }
  }, [p, map, router, pathname, currentPage, projectWithPages.pages]);

  const pageValues = (currentPage?.content?.content ?? []).reduce(
    (acc: Record<string, string>, block) => {
      const cellValue = formValues.find(
        (v) => v.column.blockNoteId === block.id,
      );
      const value = cellValue?.stringCell?.value ?? cellValue?.pointCell?.value;

      if (value) {
        // @ts-expect-error -- It's ok
        acc[block.id] = value;
      }

      return acc;
    },
    {},
  );

  if ((isUsingSessions && !currentSession) || !currentPage) {
    return null;
  }

  const prevPageIndex =
    projectWithPages.pages.findIndex((page) => page.id === currentPage.id) - 1;
  const nextPageIndex =
    projectWithPages.pages.findIndex((page) => page.id === currentPage.id) + 1;
  const prevStep = projectWithPages.pages[prevPageIndex];
  const nextStep = projectWithPages.pages[nextPageIndex];

  return (
    <MapForm
      currentPage={currentPage}
      defaultFormValues={pageValues}
      mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      onPrev={
        prevStep
          ? () => {
              setCurrentPageAndFly(prevStep);
            }
          : undefined
      }
      onStepSubmit={
        nextStep
          ? (data) => {
              if (currentSession) {
                execute({
                  pageId: currentPage.id,
                  submissionId: currentSession,
                  payload: data,
                });
              }

              setCurrentPageAndFly(nextStep);
            }
          : undefined
      }
      pageData={pageData}
      selectedFeature={selectedFeature}
    />
  );
}
