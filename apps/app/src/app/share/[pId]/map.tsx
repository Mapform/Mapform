"use client";

import Image from "next/image";
import { useMapform } from "~/components/mapform";
import { useAction } from "next-safe-action/hooks";
import React, { useEffect, useMemo, useState } from "react";
import type { GetPageData } from "@mapform/backend/data/datalayer/get-page-data";
import type { GetLayerPoint } from "@mapform/backend/data/datalayer/get-layer-point";
import { type GetLayerMarker } from "@mapform/backend/data/datalayer/get-layer-marker";
import type { GetProjectWithPages } from "@mapform/backend/data/projects/get-project-with-pages";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import type { GetSubmission } from "@mapform/backend/data/form-submissions/get-submission";
import { createSubmissionAction } from "~/data/form-submissions/create-submission";
import { motion, AnimatePresence } from "motion/react";
import mapform from "public/static/images/mapform.svg";
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
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  InfoIcon,
  PinIcon,
} from "lucide-react";
import { LocationMarker } from "~/components/mapform/map";
import { SelectionPin } from "~/components/selection-pin";
import Link from "next/link";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@mapform/ui/components/tooltip";
import { cn } from "@mapform/lib/classnames";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@mapform/ui/components/popover";

interface MapProps {
  pageData: GetPageData["data"];
  projectWithPages: NonNullable<GetProjectWithPages["data"]>;
  formValues: NonNullable<NonNullable<GetSubmission>["data"]>["row"]["cells"];
  selectedFeature?: GetLayerPoint["data"] | GetLayerMarker["data"];
  formSubmissionId: string | null;
  isUsingSessions: boolean;
}

type Page = NonNullable<GetProjectWithPages["data"]>["pages"][number];

export function Map({
  pageData,
  formSubmissionId,
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
          ...(currentPage?.contentViewType === "split" ? ["page-content"] : []),
          ...(isSearchOpen ? ["location-search"] : []),
          ...(selectedFeature ? ["feature"] : []),
        ]
      : [];
  }, [
    selectedFeature,
    isSearchOpen,
    isDrawerStackOpen,
    currentPage?.contentViewType,
  ]);
  const [isSelectingPinBlockLocationFor, setIsSelectingPinBlockLocationFor] =
    useState<string | null>(null);
  // When map view, we hide the content so we ignore form inputs on submit
  const blocknoteStepSchema = getFormSchemaFromBlockNote(
    (currentPage?.contentViewType === "split" &&
      currentPage.content?.content) ||
      [],
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

  const [currentFormSubmission, setCurrentFormSubmission] = useState<
    string | null
  >(null);

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
      let newFormSubmissionId = formSubmissionId;

      // If we don't have a submissionsDataset, we are not create sessions
      if (!isUsingSessions) {
        return;
      }

      if (!newFormSubmissionId) {
        const response = await createSubmissionAction({
          projectId: projectWithPages.id,
        });

        if (response) {
          newFormSubmissionId = response;
        }
      }
      setCurrentFormSubmission(newFormSubmissionId);
    })();
  }, [projectWithPages, formSubmissionId, isUsingSessions]);

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

  /**
   * Reset the form values when the page changes. This is to fix issue where
   * existing form values would not be set on page load.
   */
  useEffect(() => {
    form.reset(pageValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p]);

  if ((isUsingSessions && !currentFormSubmission) || !currentPage) {
    return null;
  }

  const prevPageIndex =
    projectWithPages.pages.findIndex((page) => page.id === currentPage.id) - 1;
  const nextPageIndex =
    projectWithPages.pages.findIndex((page) => page.id === currentPage.id) + 1;
  const currentPageIndex = projectWithPages.pages.findIndex(
    (page) => page.id === currentPage.id,
  );
  const prevPage = projectWithPages.pages[prevPageIndex];
  const nextPage = projectWithPages.pages[nextPageIndex];
  const isLastPage = currentPageIndex === projectWithPages.pages.length - 1;

  const onStepSubmit = (data: Record<string, string>) => {
    if (currentFormSubmission) {
      execute({
        pageId: currentPage.id,
        submissionId: currentFormSubmission,
        payload: data,
      });
    }

    if (nextPage) {
      setCurrentPageAndFly(nextPage);
    }
  };

  const controls = (
    <AnimatePresence>
      {drawerValues.length <= 1 && (
        <motion.div
          className="w-full rounded-xl border bg-white py-1.5 shadow-lg"
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.95 }}
        >
          <div className="flex justify-between gap-1.5 divide-x px-1.5">
            <Link className="underline" href="https://mapform.co">
              <Button className="px-2 py-0" type="button" variant="ghost">
                <div className="flex flex-col items-center justify-center gap-0.5">
                  <Image alt="Mapform" className="size-3.5" src={mapform} />
                  <span className="text-muted-foreground text-[10px] font-normal leading-none">
                    Mapform
                  </span>
                </div>
              </Button>
            </Link>
            <div className="pl-1.5">
              <div className="hidden md:block">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" type="button" variant="ghost">
                      <InfoIcon className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[240px]">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">{projectWithPages.name}</p>
                      {projectWithPages.description && (
                        <p className="text-gray-300">
                          {projectWithPages.description}
                        </p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
              {/* Use popover for mobile since the tooltip doesn't work */}
              <div className="md:hidden">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="icon" type="button" variant="ghost">
                      <InfoIcon className="size-5" />
                    </Button>
                  </PopoverTrigger>
                  {/* Copied from tooltip.tsx */}
                  <PopoverContent className="bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-w-[240px] overflow-hidden rounded-md border-none px-3 py-1.5 text-xs">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">{projectWithPages.name}</p>
                      {projectWithPages.description && (
                        <p className="text-gray-300">
                          {projectWithPages.description}
                        </p>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            {projectWithPages.pages.length > 1 && (
              <div className="flex flex-1 gap-1.5 pl-1.5">
                <Button
                  disabled={!prevPage}
                  onClick={() => {
                    prevPage && setCurrentPageAndFly(prevPage);
                  }}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <ArrowLeftIcon className="size-5" />
                </Button>
                <Button
                  className="flex-1"
                  disabled={!nextPage || currentPage.pageType !== "page"}
                  type="submit"
                >
                  {nextPage
                    ? nextPage.pageType === "page_ending"
                      ? "Submit"
                      : "Next"
                    : isLastPage
                      ? "Done"
                      : null}
                  {nextPage ? (
                    <ArrowRightIcon className="ml-1 -mr-1 size-5" />
                  ) : (
                    <CheckIcon className="ml-1 -mr-1 size-5" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const handleLocationSearch = (val: string | null) => {
    // TODO: Improve this temporary workaround. If you don't
    // scroll to the bottom first, there is a jarring animation
    // when opening the next drawer
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setIsSearching(true);
      setQueryString({
        key: "feature",
        value: null,
      });
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
        className="flex flex-col w-full h-full md:overflow-hidden"
        onSubmit={form.handleSubmit(onStepSubmit)}
      >
        <MapformContent drawerValues={drawerValues} pageData={pageData}>
          {currentPage.contentViewType === "split" ? (
            <MapformDrawerButton
              onDrawerStackOpenChange={setIsDrawerStackOpen}
            />
          ) : null}
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
            <div className="absolute z-10 flex items-center transform -translate-x-1/2 pointer-events-auto bottom-8 left-1/2 max-md:hidden">
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
              mobileBottomPadding
              value="page-content"
            >
              <Blocknote
                description={currentPage.content as { content: CustomBlock[] }}
                icon={currentPage.icon}
                key={currentPage.id}
                title={currentPage.title}
              />
            </MapformDrawer>
            {/* Mobile controls */}
            <div
              className={cn(
                "pointer-events-auto fixed bottom-2 left-1/2 z-50 flex -translate-x-1/2 transform items-center md:hidden",
                {
                  "w-[calc(100%-1rem)]": projectWithPages.pages.length > 1,
                },
              )}
            >
              {controls}
            </div>
            <MapformDrawer
              mobileBottomPadding
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
            hideDragBar
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
                size="sm"
              >
                <PinIcon className="mr-1 size-4" />
                Select Location
              </LocationSearchButton>
            </LocationSearch>
          </MapformDrawer>
        </MapformContent>
      </form>
    </Form>
  );
}
