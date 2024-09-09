"use client";

import dynamic from "next/dynamic";
import { MapForm } from "@mapform/mapform";
import { toast } from "@mapform/ui/components/toaster";
import type { CustomBlock } from "@mapform/blocknote";
import {
  Settings2Icon,
  SettingsIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import { uploadImage } from "~/data/images";
import { updateStepWithLocation } from "~/data/steps/update-location";
import { env } from "~/env.mjs";
import { useContainerContext } from "../context";
import {
  StepDrawerRoot,
  StepDrawerTrigger,
  StepDrawerContent,
} from "./step-drawer";
import { PagePicker } from "./page-picker";
import { PageBarButton } from "./page-bar-button";

function MapFormContainer() {
  const {
    points,
    currentStep,
    formWithSteps,
    setQueryParamFor,
    currentEditableStep,
    debouncedUpdateStep,
  } = useContainerContext();

  if (!currentStep) {
    return null;
  }

  return (
    <div className="p-4 flex-1 flex justify-center overflow-hidden">
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex justify-between mb-4 overflow-hidden">
          <div className="flex overflow-x-auto no-scrollbar">
            <PagePicker />
          </div>
          {/* Edit controls */}
          <div className="flex gap-1">
            <StepDrawerRoot
              key={currentStep.id}
              onOpenChange={(isOpen) => {
                if (!isOpen && currentEditableStep?.id === currentStep.id)
                  setQueryParamFor("e");
              }}
              open={currentEditableStep?.id === currentStep.id}
            >
              <StepDrawerTrigger asChild>
                <PageBarButton
                  Icon={Settings2Icon}
                  isActive={currentEditableStep?.id === currentStep.id}
                  onClick={() => {
                    setQueryParamFor("e", currentStep);
                  }}
                >
                  Edit Page
                </PageBarButton>
              </StepDrawerTrigger>
              <StepDrawerContent />
            </StepDrawerRoot>
          </div>
        </div>

        <div className="flex-1 flex pl-8">
          <MapForm
            currentStep={currentStep}
            editable
            mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            onDescriptionChange={async (content: {
              content: CustomBlock[];
            }) => {
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
            onLocationSave={async (location) => {
              await updateStepWithLocation({
                stepId: currentStep.id,
                data: {
                  latitude: location.latitude,
                  longitude: location.longitude,
                  zoom: location.zoom,
                  pitch: location.pitch,
                  bearing: location.bearing,
                },
              }).catch(() => {
                toast("Failed to update location");
                return { success: false };
              });

              return { success: true };
            }}
            onTitleChange={async (content: string) => {
              await debouncedUpdateStep({
                stepId: currentStep.id,
                data: {
                  title: content,
                  formId: formWithSteps.id,
                },
              });
            }}
            points={points}
          />
        </div>
      </div>
    </div>
  );
}

// This is to avoid SSR caused by Blocknote / Tiptap
export default dynamic(() => Promise.resolve(MapFormContainer), { ssr: false });
