"use client";

import dynamic from "next/dynamic";
import { MapForm } from "@mapform/mapform";
import { toast } from "@mapform/ui/components/toaster";
import type { CustomBlock } from "@mapform/blocknote";
import { Button } from "@mapform/ui/components/button";
import { EllipsisIcon, Monitor, Smartphone } from "lucide-react";
import { uploadImage } from "~/data/images";
import { env } from "~/env.mjs";
import { useContainerContext } from "../context";
import {
  StepDrawerRoot,
  StepDrawerTrigger,
  StepDrawerContent,
} from "./step-drawer";
import { PagePicker } from "./page-picker";

function MapFormContainer({
  setMapformLoaded,
}: {
  setMapformLoaded: (loaded: boolean) => void;
}) {
  const {
    map,
    points,
    viewState,
    onMoveEnd,
    setBounds,
    currentStep,
    setViewState,
    formWithSteps,
    setQueryParamFor,
    currentEditableStep,
    debouncedUpdateStep,
  } = useContainerContext();

  return (
    <div className="p-4 flex-1 flex justify-center overflow-hidden">
      <div className="flex flex-col flex-1">
        <div className="group flex-1 flex justify-between mb-4">
          <div className="flex">{/* Empty for now */}</div>
          {/* Edit controls */}
          <div className="flex gap-1">
            <StepDrawerRoot
              onOpenChange={(isOpen) => {
                if (!isOpen && currentEditableStep?.id === currentStep?.id)
                  setQueryParamFor("e");
              }}
              open={currentEditableStep?.id === currentStep?.id}
            >
              <StepDrawerTrigger asChild>
                <Button
                  className="data-[state=open]:bg-stone-200 hover:bg-stone-200"
                  onClick={() => {
                    setQueryParamFor("e", currentStep?.id);
                  }}
                  size="icon-sm"
                  variant="ghost"
                >
                  <EllipsisIcon className="h-5 w-5" />
                </Button>
              </StepDrawerTrigger>
              <StepDrawerContent />
            </StepDrawerRoot>
            <PagePicker />
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
