"use client";

import { MapForm, useMap } from "@mapform/mapform";
import { useAction } from "next-safe-action/hooks";
import React, { useEffect, useState } from "react";
import type { PageData } from "@mapform/map-utils/types";
import { useCreateQueryString } from "@mapform/lib/hooks/use-create-query-string";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { submitPage } from "~/data/submit-page";
import { createSubmission } from "~/data/create-submission";
import type { Responses } from "~/data/get-responses.ts";
import type { ProjectWithPages } from "~/data/get-project-with-pages";
import { env } from "../env.mjs";

interface MapProps {
  pageData: PageData | undefined;
  projectWithPages: ProjectWithPages;
  formValues: NonNullable<Responses>["cells"];
  sessionId: string | null;
}

type Page = ProjectWithPages["pages"][number];

export function Map({
  projectWithPages,
  formValues,
  sessionId,
  pageData,
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

  const { map } = useMap();

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
  }, []);

  /**
   * Fix the 'p' query param if no valid page
   */
  useEffect(() => {
    if (projectWithPages.pages[0] && (!p || !currentPage)) {
      const firstStep = projectWithPages.pages[0];

      router.push(
        `${pathname}?${createQueryString("p", projectWithPages.pages[0].id)}`
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
        (v) => v.column.blockNoteId === block.id
      );
      const value = cellValue?.stringCell?.value ?? cellValue?.pointCell?.value;

      if (value) {
        // @ts-expect-error -- It's ok
        acc[block.id] = value;
      }

      return acc;
    },
    {}
  );

  if (!currentSession || !currentPage) {
    return null;
  }

  return (
    <MapForm
      currentPage={currentPage}
      defaultFormValues={pageValues}
      mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      onPrev={() => {
        const prevPageIndex =
          projectWithPages.pages.findIndex(
            (page) => page.id === currentPage.id
          ) - 1;
        const prevStep = projectWithPages.pages[prevPageIndex];

        if (prevStep) {
          setCurrentPageAndFly(prevStep);
        }
      }}
      onStepSubmit={(data) => {
        execute({
          pageId: currentPage.id,
          submissionId: currentSession,
          payload: data,
        });

        const nextPageIndex =
          projectWithPages.pages.findIndex(
            (page) => page.id === currentPage.id
          ) + 1;
        const nextStep = projectWithPages.pages[nextPageIndex];

        if (nextStep) {
          setCurrentPageAndFly(nextStep);
        }
      }}
      pageData={pageData}
    />
  );
}
