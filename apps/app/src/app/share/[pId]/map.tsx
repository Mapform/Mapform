"use client";

import { MapForm, useMapform } from "@mapform/mapform";
import { useAction } from "next-safe-action/hooks";
import React, { useEffect, useState } from "react";
import type { PageData } from "@mapform/backend/datalayer/get-page-data";
import type { GetLayerPoint } from "@mapform/backend/datalayer/get-layer-point";
import { useCreateQueryString } from "@mapform/lib/hooks/use-create-query-string";
import type { ProjectWithPages } from "@mapform/backend/projects/get-project-with-pages";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { submitPage } from "~/data/share/submit-page";
import { createSubmission } from "~/data/share/create-submission";
import type { Responses } from "~/data/share/get-responses.ts";
import { env } from "~/env.mjs";

interface MapProps {
  pageData: PageData | undefined;
  projectWithPages: ProjectWithPages;
  formValues: NonNullable<Responses>["cells"];
  layerPoint?: GetLayerPoint;
  sessionId: string | null;
  isUsingSessions: boolean;
}

type Page = ProjectWithPages["pages"][number];

export function Map({
  pageData,
  sessionId,
  layerPoint,
  formValues,
  isUsingSessions,
  projectWithPages,
}: MapProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCreateQueryString();

  const p = searchParams.get("p");
  const currentPage = projectWithPages.pages.find((page) => page.id === p);
  const setCurrentPage = (page: Page) => {
    router.push(`${pathname}?${createQueryString("p", page.id)}`);
  };

  const { map } = useMapform();

  const [currentSession, setCurrentSession] = useState<string | null>(null);

  const { execute } = useAction(submitPage);

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
        const response = await createSubmission({
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

      router.push(
        `${pathname}?${createQueryString("p", projectWithPages.pages[0].id)}`,
      );

      map?.flyTo({
        center: [firstStep.center.x, firstStep.center.y],
        zoom: firstStep.zoom,
        pitch: firstStep.pitch,
        bearing: firstStep.bearing,
        duration: 1000,
      });
    }
  }, [
    p,
    map,
    router,
    pathname,
    currentPage,
    createQueryString,
    projectWithPages.pages,
  ]);

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
      selectedFeature={layerPoint}
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
    />
  );
}
