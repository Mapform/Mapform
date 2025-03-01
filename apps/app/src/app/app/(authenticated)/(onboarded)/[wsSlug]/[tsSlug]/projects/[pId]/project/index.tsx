"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
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

function Project() {
  const {
    currentPage,
    selectedFeature,
    currentPageData,
    projectWithPages,
    updateSelectedFeatureOptimistic,
    updatePageServerAction,
    upsertCellServerAction,
    uploadImageServerAction,
  } = useProject();

  // This is just used to prevent the input blocks from throwing an error when
  // calling useFormContext
  const dummyForm = useForm();

  const [drawerValues, setDrawerValues] = useState<string[]>([
    "page-content",
    ...(selectedFeature ? ["feature"] : []),
  ]);

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
                    await uploadImageServerAction.execute(formData);

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
                    updatePageServerAction.execute({
                      id: currentPage.id,
                      content: val,
                    });
                  }}
                  onIconChange={(val) => {
                    updatePageServerAction.execute({
                      id: currentPage.id,
                      icon: val,
                    });
                  }}
                  onTitleChange={(val) => {
                    updatePageServerAction.execute({
                      id: currentPage.id,
                      title: val,
                    });
                  }}
                  title={updatePageServerAction.optimisticState?.title}
                />
              </MapformDrawer>
              <MapformDrawer
                onClose={() => {
                  setDrawerValues(drawerValues.filter((v) => v !== "feature"));
                }}
                value="feature"
              >
                <Blocknote
                  description={
                    selectedFeature?.description?.richtextCell?.value ??
                    undefined
                  }
                  icon={selectedFeature?.icon?.iconCell?.value}
                  key={`${currentPage.id}-${selectedFeature?.rowId}`}
                  onDescriptionChange={(value) => {
                    if (!selectedFeature?.description) {
                      return;
                    }

                    upsertCellServerAction.execute({
                      type: "richtext",
                      value,
                      rowId: selectedFeature.rowId,
                      columnId: selectedFeature.description.columnId,
                    });
                  }}
                  onIconChange={(value) => {
                    if (!selectedFeature?.icon || !currentPageData) {
                      return;
                    }

                    if (selectedFeature.icon.iconCell) {
                      updateSelectedFeatureOptimistic({
                        ...selectedFeature,
                        icon: {
                          ...selectedFeature.icon,
                          iconCell: {
                            ...selectedFeature.icon.iconCell,
                            value,
                          },
                        },
                      });
                    }

                    upsertCellServerAction.execute({
                      type: "icon",
                      value,
                      rowId: selectedFeature.rowId,
                      columnId: selectedFeature.icon.columnId,
                    });
                  }}
                  onTitleChange={(value) => {
                    if (!selectedFeature?.title) {
                      return;
                    }

                    upsertCellServerAction.execute({
                      type: "string",
                      value,
                      rowId: selectedFeature.rowId,
                      columnId: selectedFeature.title.columnId,
                    });
                  }}
                  title={selectedFeature?.title?.stringCell?.value}
                />
              </MapformDrawer>
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
