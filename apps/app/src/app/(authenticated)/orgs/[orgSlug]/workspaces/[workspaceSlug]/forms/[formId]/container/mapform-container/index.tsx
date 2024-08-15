"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { MapForm } from "@mapform/mapform";
import { toast } from "@mapform/ui/components/toaster";
import type { CustomBlock } from "@mapform/blocknote";
import { Button } from "@mapform/ui/components/button";
import {
  ChevronDown,
  EllipsisIcon,
  GripVerticalIcon,
  PlusIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { uploadImage } from "~/data/images";
import { createStep } from "~/data/steps/create";
import { env } from "~/env.mjs";
import { useContainerContext } from "../context";
import {
  StepDrawerRoot,
  StepDrawerTrigger,
  StepDrawerContent,
} from "./step-drawer";
import { cn } from "@mapform/lib/classnames";

function MapFormContainer({
  setMapformLoaded,
}: {
  setMapformLoaded: (loaded: boolean) => void;
}) {
  const {
    dragSteps,
    formWithSteps,
    currentStep,
    setViewState,
    viewState,
    map,
    debouncedUpdateStep,
    onMoveEnd,
    points,
    setBounds,
    currentStepIndex,
    setQueryParamFor,
  } = useContainerContext();

  const { executeAsync } = useAction(createStep);
  const pathname = usePathname();

  return (
    <div className="p-4 flex-1 flex justify-center overflow-hidden">
      <div className="flex flex-col flex-1">
        <div className="group flex-1 flex justify-between mb-2 -mt-2">
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-stone-500">
            {/* <Button size="sm" variant="ghost">
              Add cover
            </Button>
            <Button size="sm" variant="ghost">
              Add icon
            </Button> */}
          </div>
          {/* Edit controls */}
          <div className="flex gap-1">
            <StepDrawerRoot>
              <StepDrawerTrigger>
                <Button size="icon-sm" variant="ghost">
                  <EllipsisIcon className="h-5 w-5" />
                </Button>
              </StepDrawerTrigger>
              <StepDrawerContent />
            </StepDrawerRoot>
            <Popover>
              <PopoverTrigger>
                <Button size="sm">
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Page {currentStepIndex + 1}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 overflow-hidden">
                <div className="px-3 py-2 border-b">
                  <div className="w-full flex flex-col">
                    <div className="flex flex-col gap-1">
                      {dragSteps.map((step, index) => (
                        <Link
                          className={cn(
                            "flex items-center justify-between hover:bg-stone-100 py-1.5 px-2 -mx-2 transition-colors rounded",
                            {
                              "bg-stone-100": step === currentStep?.id,
                            }
                          )}
                          href={`${pathname}?s=${step}`}
                          key={step}
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <div className="h-4 w-4 flex items-center justify-center flex-shrink-0">
                              <GripVerticalIcon className="h-4 w-4 flex-shrink-0" />
                            </div>
                            <span className="truncate">Page {index + 1}</span>
                          </div>
                          {/* {!currentOrg && (
                          <div className="h-4 w-4 flex items-center justify-center">
                            <CheckIcon className="h-4 w-4 flex-shrink-0" />
                          </div>
                        )} */}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="px-3 py-2 bg-stone-50">
                  <div className="w-full flex flex-col">
                    <button
                      className="appearance-none flex gap-2 items-center text-left hover:bg-stone-100 py-1.5 px-2 -mx-2 transition-colors rounded"
                      onClick={async () => {
                        const newStep = await executeAsync({
                          formId: formWithSteps.id,
                          location: viewState,
                        });

                        setQueryParamFor("s", newStep?.data?.id);
                      }}
                      type="button"
                    >
                      <div className="h-4 w-4 flex items-center justify-center">
                        <PlusIcon className="h-4 w-4 flex-shrink-0" />
                      </div>
                      Create new page
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <MapForm
          currentStep={currentStep}
          editable
          mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          onDescriptionChange={async (content: { content: CustomBlock[] }) => {
            if (!currentStep) {
              return;
            }

            await debouncedUpdateStep({
              stepId: currentStep.id,
              data: {
                description: content,
                formId: formWithSteps.id,
              },
            });
          }}
          onImageUpload={async (file: File) => {
            const formData = new FormData();
            formData.append("image", file);

            const { success, error } = await uploadImage(formData);

            if (error) {
              toast(error);
              return null;
            }

            return success?.url || null;
          }}
          onLoad={() => {
            const bounds = map.current?.getBounds();
            setBounds(bounds);
            setMapformLoaded(true);
          }}
          onMoveEnd={onMoveEnd}
          onTitleChange={async (content: string) => {
            if (!currentStep) {
              return;
            }

            await debouncedUpdateStep({
              stepId: currentStep.id,
              data: {
                title: content,
                formId: formWithSteps.id,
              },
            });
          }}
          points={points}
          ref={map}
          setViewState={setViewState}
          viewState={viewState}
        />
      </div>
    </div>
  );
}

// To this to avoid SSR caused by Blocknote / Tiptap
export default dynamic(() => Promise.resolve(MapFormContainer), { ssr: false });
