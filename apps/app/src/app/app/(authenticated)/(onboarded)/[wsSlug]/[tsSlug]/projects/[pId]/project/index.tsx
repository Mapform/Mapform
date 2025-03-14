"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { compressImage } from "~/lib/compress-image";
import { useProject } from "../project-context";
import { EditBar } from "./edit-bar";
import {
  MapformContent,
  MapformDrawer,
  MapformDrawerButton,
  MapformMap,
} from "~/components/mapform";
import { CustomBlockProvider, type CustomBlock } from "@mapform/blocknote";
import { Blocknote } from "~/components/mapform/block-note";
import { LocationSearchDrawer } from "./location-search-drawer";
import { Form as DummyForm, useForm } from "@mapform/ui/components/form";
import { BlocknoteControls } from "./blocknote-controls";
import { FeatureDrawer } from "./feature-drawer";

function Project() {
  const {
    selectedFeature,
    currentPageData,
    projectWithPages,
    updatePageServerAction,
    uploadImageServerAction,
  } = useProject();

  // This is just used to prevent the input blocks from throwing an error when
  // calling useFormContext
  const dummyForm = useForm();

  const currentPage = updatePageServerAction.optimisticState;

  const [drawerValues, setDrawerValues] = useState<string[]>([
    "page-content",
    ...(selectedFeature ? ["feature"] : []),
  ]);

  useEffect(() => {
    const featureIsOpen = drawerValues.includes("feature");

    if (selectedFeature) {
      if (!featureIsOpen) {
        setDrawerValues([...drawerValues, "feature"]);
      }
    } else if (featureIsOpen) {
      setDrawerValues(drawerValues.filter((v) => v !== "feature"));
    }
  }, [selectedFeature, drawerValues]);

  if (!currentPage) {
    return null;
  }

  return (
    <DummyForm {...dummyForm}>
      <div className="flex flex-1 justify-center overflow-hidden p-4">
        <div className="flex flex-1">
          <MapformContent
            isEditing
            drawerValues={drawerValues}
            onDrawerValuesChange={setDrawerValues}
            pageData={currentPageData}
          >
            <CustomBlockProvider
              isEditing
              imageBlock={{
                onImageUpload: async (file: File) => {
                  const compressedFile = await compressImage(
                    file,
                    0.8,
                    2000,
                    2000,
                    1000,
                  );
                  const formData = new FormData();
                  formData.append("image", compressedFile);

                  const response =
                    await uploadImageServerAction.executeAsync(formData);

                  if (response?.serverError) {
                    return null;
                  }

                  return response?.data?.url || null;
                },
              }}
            >
              <MapformDrawer
                onClose={() => {
                  setDrawerValues(
                    drawerValues.filter((v) => v !== "page-content"),
                  );
                }}
                value="page-content"
              >
                <Blocknote
                  controls={
                    <BlocknoteControls
                      allowAddEmoji={
                        !updatePageServerAction.optimisticState?.icon
                      }
                      onIconChange={(value) => {
                        void updatePageServerAction.execute({
                          ...currentPage,
                          icon: value,
                        });
                      }}
                    />
                  }
                  description={
                    currentPage.content as { content: CustomBlock[] }
                  }
                  icon={updatePageServerAction.optimisticState?.icon}
                  includeFormBlocks={
                    projectWithPages.formsEnabled &&
                    currentPage.pageType === "page"
                  }
                  key={currentPage.id}
                  onDescriptionChange={(val) => {
                    void updatePageServerAction.execute({
                      ...currentPage,
                      content: val,
                    });
                  }}
                  onIconChange={(val) => {
                    void updatePageServerAction.execute({
                      ...currentPage,
                      icon: val,
                    });
                  }}
                  onTitleChange={(val) => {
                    void updatePageServerAction.execute({
                      ...currentPage,
                      title: val,
                    });
                  }}
                  title={updatePageServerAction.optimisticState?.title}
                />
              </MapformDrawer>
              <FeatureDrawer />
              <LocationSearchDrawer currentPage={currentPage} />
            </CustomBlockProvider>
            <MapformDrawerButton
              onOpen={() => setDrawerValues([...drawerValues, "page-content"])}
            />
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
              <EditBar key={currentPage.id} />
            </MapformMap>
          </MapformContent>
        </div>
      </div>
    </DummyForm>
  );
}

// This is to avoid SSR caused by Blocknote / Tiptap
export default dynamic(() => Promise.resolve(Project), { ssr: false });
