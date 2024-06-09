"use client";

import dynamic from "next/dynamic";
import { MapForm } from "@mapform/mapform";
import type { CustomBlock } from "@mapform/mapform/lib/block-note-schema";
import { uploadImage } from "~/server/actions/images";
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
  } = useContainerContext();

  return (
    <div className="p-8 flex-1 flex justify-center">
      <div className="max-w-screen-lg flex-1 border overflow-hidden">
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

            const image = await uploadImage(formData);

            return image.url;
          }}
          onLoad={() => {
            setMapformLoaded(true);
          }}
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
          ref={map}
          setViewState={(evt) => {
            setViewState(evt.viewState);
          }}
          viewState={viewState}
        />
      </div>
    </div>
  );
}

// To this to avoid SSR caused by Blocknote / Tiptap
export default dynamic(() => Promise.resolve(MapFormContainer), { ssr: false });
