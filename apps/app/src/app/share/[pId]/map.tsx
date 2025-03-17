"use client";

import { useMapform } from "~/components/mapform";
import { useAction } from "next-safe-action/hooks";
import React, { useEffect, useMemo, useState } from "react";
import type { GetPageData } from "@mapform/backend/data/datalayer/get-page-data";
import type { GetLayerPoint } from "@mapform/backend/data/datalayer/get-layer-point";
import { type GetLayerMarker } from "@mapform/backend/data/datalayer/get-layer-marker";
import type { GetProjectWithPages } from "@mapform/backend/data/projects/get-project-with-pages";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import type { Responses } from "@mapform/backend/data/rows/get-responses";
import { createSubmissionAction } from "~/data/rows/create-submission";
import {
  CustomBlockProvider,
  getFormSchemaFromBlockNote,
  type CustomBlock,
} from "@mapform/blocknote";
import { submitPageAction } from "./actions";
import {
  MapformContent,
  MapformDrawer,
  MapformDrawerButton,
  MapformMap,
} from "~/components/mapform";
import { Blocknote } from "~/components/mapform/block-note";
import { Form, useForm, zodResolver } from "@mapform/ui/components/form";
import { useSetQueryString } from "@mapform/lib/hooks/use-set-query-string";
import type { z } from "zod";
import {
  LocationSearch,
  LocationSearchButton,
} from "~/components/location-search";
import { Button } from "@mapform/ui/components/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { LocationMarker } from "~/components/mapform/map";
import { SelectionPin } from "~/components/selection-pin";

interface MapProps {
  pageData: GetPageData["data"];
  projectWithPages: NonNullable<GetProjectWithPages["data"]>;
  formValues: NonNullable<NonNullable<Responses>["data"]>["cells"];
  selectedFeature?: GetLayerPoint["data"] | GetLayerMarker["data"];
  sessionId: string | null;
  isUsingSessions: boolean;
}

type Page = NonNullable<GetProjectWithPages["data"]>["pages"][number];

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
  const setQueryString = useSetQueryString();
  const currentPage = projectWithPages.pages.find((page) => page.id === p);
  const [isSearchOpen, setIsSearching] = useState(false);
  const [isDrawerStackOpen, setIsDrawerStackOpen] = useState(true);
  const drawerValues = useMemo(() => {
    return isDrawerStackOpen
      ? [
          "page-content",
          ...(selectedFeature ? ["feature"] : []),
          ...(isSearchOpen ? ["location-search"] : []),
        ]
      : [];
  }, [selectedFeature, isSearchOpen, isDrawerStackOpen]);
  const [isSelectingPinBlockLocationFor, setIsSelectingPinBlockLocationFor] =
    useState<string | null>(null);
  const blocknoteStepSchema = getFormSchemaFromBlockNote(
    currentPage?.content?.content || [],
  );

  const pageValues = (currentPage?.content?.content ?? []).reduce(
    (acc: Record<string, string>, block) => {
      const cellValue = formValues.find(
        (v) => v.column.blockNoteId === block.id,
      );
      const value = cellValue?.stringCell?.value ?? cellValue?.pointCell;

      if (value) {
        // @ts-expect-error -- It's ok
        acc[block.id] = value;
      }

      return acc;
    },
    {},
  );

  const form = useForm<z.infer<typeof blocknoteStepSchema>>({
    resolver: zodResolver(blocknoteStepSchema),
    defaultValues: pageValues,
  });

  const currentFormValues = form.getValues();

  const selectedLocations = useMemo(() => {
    return (
      currentPage?.content?.content
        .filter((block) => block.type === "pin")
        .map((block) => {
          const value = currentFormValues[block.id] as
            | {
                x: number;
                y: number;
              }
            | undefined;

          if (!value) {
            return null;
          }

          return {
            ...value,
            blockId: block.id,
          };
        })
        .filter(
          (location) =>
            location !== null &&
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            location.x !== undefined &&
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            location.y !== undefined,
        ) ?? []
    );
  }, [currentPage, currentFormValues]);

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

  // Reset isDrawerStackOpen when the search or feature is opened
  useEffect(() => {
    if (isSearchOpen || !!selectedFeature) {
      setIsDrawerStackOpen(true);
    }
  }, [isSearchOpen, selectedFeature]);

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

        if (response) {
          newSessionId = response;
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

  if ((isUsingSessions && !currentSession) || !currentPage) {
    return null;
  }

  const prevPageIndex =
    projectWithPages.pages.findIndex((page) => page.id === currentPage.id) - 1;
  const nextPageIndex =
    projectWithPages.pages.findIndex((page) => page.id === currentPage.id) + 1;
  const prevPage = projectWithPages.pages[prevPageIndex];
  const nextPage = projectWithPages.pages[nextPageIndex];

  const onStepSubmit = (data: Record<string, string>) => {
    if (currentSession) {
      execute({
        pageId: currentPage.id,
        submissionId: currentSession,
        payload: data,
      });
    }

    if (nextPage) {
      setCurrentPageAndFly(nextPage);
    }
  };

  const controls = (
    <div className="divide-x rounded-xl border bg-white p-1.5 shadow-lg">
      {prevPage ? (
        <Button
          onClick={() => {
            setCurrentPageAndFly(prevPage);
          }}
          type="button"
          variant="ghost"
        >
          <ArrowLeftIcon className="-ml-1 mr-1 size-4" />
          Back
        </Button>
      ) : null}
      <p className="mx-auto text-xs text-gray-500">
        Made with{" "}
        <a className="text-gray-500 underline" href="https://alpha.mapform.co">
          Mapform
        </a>
      </p>
      {nextPage && currentPage.pageType === "page" ? (
        <Button type="submit">
          {nextPage.pageType === "page_ending" ? "Submit" : "Next"}
          <ArrowRightIcon className="-mr-1 ml-1 size-4" />
        </Button>
      ) : null}
    </div>
  );

  const handleLocationSearch = (val: string | null) => {
    // TODO: Improve this temporary workaround. If you don't
    // scroll to the bottom first, there is a jarring animation
    // when opening the next drawer
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setIsSearching(true);
      setIsSelectingPinBlockLocationFor(val);

      const location = selectedLocations.find(
        (location) => location?.blockId === val,
      );

      if (location) {
        map?.flyTo({
          center: [location.x, location.y],
          duration: 0,
        });
      }
    }, 500);
  };

  return (
    <Form {...form}>
      <form
        className="flex h-full w-full flex-col md:overflow-hidden"
        onSubmit={form.handleSubmit(onStepSubmit)}
      >
        <MapformContent drawerValues={drawerValues} pageData={pageData}>
          <MapformDrawerButton onDrawerStackOpenChange={setIsDrawerStackOpen} />
          <MapformMap
            initialViewState={{
              longitude: currentPage.center.x,
              latitude: currentPage.center.y,
              zoom: currentPage.zoom,
              bearing: currentPage.bearing,
              pitch: currentPage.pitch,
              padding: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
              },
            }}
          >
            {!drawerValues.includes("location-search")
              ? selectedLocations.map((location) => {
                  if (!location) {
                    return null;
                  }

                  return (
                    <button
                      key={`${location.x}-${location.y}`}
                      onClick={() => {
                        handleLocationSearch(location.blockId);
                      }}
                    >
                      <LocationMarker
                        latitude={location.y}
                        longitude={location.x}
                      >
                        <SelectionPin />
                      </LocationMarker>
                    </button>
                  );
                })
              : null}
            <div className="pointer-events-auto absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 transform items-center">
              {controls}
            </div>
          </MapformMap>
          <CustomBlockProvider
            pinBlock={{
              isSelectingLocationFor: isSelectingPinBlockLocationFor,
              setIsSelectingLocationFor: handleLocationSearch,
            }}
          >
            <MapformDrawer
              onClose={() => {
                setIsDrawerStackOpen(false);
              }}
              value="page-content"
            >
              <Blocknote
                description={currentPage.content as { content: CustomBlock[] }}
                icon={currentPage.icon}
                key={currentPage.id}
                title={currentPage.title}
              />
              {/* {drawerValues.length > 1 ? null : (
                <div className="hidden sm:block">{controls}</div>
              )} */}
            </MapformDrawer>
            {/* {drawerValues.length > 1 ? null : (
              <div className="hidden max-sm:block">{controls}</div>
            )} */}
            <MapformDrawer
              onClose={() => {
                setQueryString({
                  key: "feature",
                  value: null,
                });
              }}
              value="feature"
            >
              <Blocknote
                isFeature
                description={
                  selectedFeature?.description?.richtextCell?.value ?? undefined
                }
                icon={selectedFeature?.icon?.iconCell?.value}
                key={`${currentPage.id}-${selectedFeature?.rowId}`}
                title={selectedFeature?.title?.stringCell?.value}
              />
            </MapformDrawer>
          </CustomBlockProvider>
          <MapformDrawer
            className="bottom-0 max-sm:fixed"
            value="location-search"
            onClose={() => {
              setIsSearching(false);
            }}
          >
            <LocationSearch>
              <LocationSearchButton
                onClick={(selectedFeature) => {
                  form.setValue(
                    `${isSelectingPinBlockLocationFor}.y`,
                    selectedFeature?.properties?.lat,
                  );
                  form.setValue(
                    `${isSelectingPinBlockLocationFor}.x`,
                    selectedFeature?.properties?.lon,
                  );
                  void form.trigger();
                  setIsSelectingPinBlockLocationFor(null);
                  setIsSearching(false);
                }}
              >
                Select Location
              </LocationSearchButton>
            </LocationSearch>
          </MapformDrawer>
        </MapformContent>
      </form>
    </Form>
  );
}
