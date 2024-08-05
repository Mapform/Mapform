"use client";

import dynamic from "next/dynamic";
import { MapForm } from "@mapform/mapform";
import { toast } from "@mapform/ui/components/toaster";
import type { CustomBlock } from "@mapform/blocknote";
import { uploadImage } from "~/data/images";
import { env } from "~/env.mjs";
import { useContainerContext } from "../context";

function MapFormContainer({
  setMapformLoaded,
}: {
  setMapformLoaded: (loaded: boolean) => void;
}) {
  const {
    formWithSteps,
    currentStep,
    setViewState,
    viewState,
    map,
    debouncedUpdateStep,
    onMoveEnd,
    points,
    setBounds,
  } = useContainerContext();

  return (
    <div className="p-6 flex-1 flex justify-center">
      <div className="flex flex-col flex-1 border rounded-md overflow-hidden max-w-[1000px]">
        <div className="flex border-b justify-between bg-white py-1 px-4">
          <h3 className="text-xs font-semibold leading-6 text-gray-400">
            Preview
          </h3>
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
