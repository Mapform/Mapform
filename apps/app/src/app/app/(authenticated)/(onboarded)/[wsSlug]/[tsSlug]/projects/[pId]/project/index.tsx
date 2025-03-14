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
import { useSetQueryString } from "@mapform/lib/hooks/use-set-query-string";
import { CustomBlockProvider, type CustomBlock } from "@mapform/blocknote";
import { Blocknote } from "~/components/mapform/block-note";
import { LocationSearchDrawer } from "./location-search-drawer";
import { Form as DummyForm, useForm } from "@mapform/ui/components/form";
import { BlocknoteControls } from "./blocknote-controls";

function Project() {
  const {
    currentPageData,
    projectWithPages,
    updatePageServerAction,
    upsertIconCellServerAction,
    upsertStringCellServerAction,
    upsertRichtextCellServerAction,
    uploadImageServerAction,
  } = useProject();

  // This is just used to prevent the input blocks from throwing an error when
  // calling useFormContext
  const dummyForm = useForm();
  const setQueryString = useSetQueryString();

  const currentPage = updatePageServerAction.optimisticState;
  const selectedFeatureIcon = upsertIconCellServerAction.optimisticState;
  const selectedFeatureTitle = upsertStringCellServerAction.optimisticState;
  const selectedFeatureDescription =
    upsertRichtextCellServerAction.optimisticState;

  const [drawerValues, setDrawerValues] = useState<string[]>([
    "page-content",
    ...(selectedFeatureIcon ||
    selectedFeatureTitle ||
    selectedFeatureDescription
      ? ["feature"]
      : []),
  ]);

  useEffect(() => {
    const featureIsOpen = drawerValues.includes("feature");

    if (
      selectedFeatureIcon ||
      selectedFeatureTitle ||
      selectedFeatureDescription
    ) {
      if (!featureIsOpen) {
        setDrawerValues([...drawerValues, "feature"]);
      }
    } else if (featureIsOpen) {
      setDrawerValues(drawerValues.filter((v) => v !== "feature"));
    }
  }, [
    selectedFeatureIcon,
    selectedFeatureTitle,
    selectedFeatureDescription,
    drawerValues,
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
                  controls={
                    <BlocknoteControls
                      allowAddEmoji={
                        !!selectedFeatureIcon?.icon?.columnId &&
                        !selectedFeatureIcon.icon.iconCell?.value
                      }
                      allowAddProperties
                      onIconChange={(value) => {
                        if (!selectedFeatureIcon?.icon || !currentPageData) {
                          return;
                        }

                        if (!selectedFeatureIcon.icon.columnId) {
                          return;
                        }

                        void upsertIconCellServerAction.execute({
                          type: "icon",
                          value,
                          rowId: selectedFeatureIcon.rowId,
                          columnId: selectedFeatureIcon.icon.columnId,
                        });
                      }}
                    />
                  }
                  description={
                    selectedFeatureDescription?.description?.columnId
                      ? selectedFeatureDescription.description.richtextCell
                          ?.value ?? null
                      : undefined
                  }
                  icon={
                    selectedFeatureIcon?.icon?.columnId
                      ? selectedFeatureIcon.icon.iconCell?.value ?? null
                      : undefined
                  }
                  key={`${currentPage.id}-${selectedFeatureIcon?.rowId}-${selectedFeatureDescription?.description?.columnId}`}
                  onDescriptionChange={(value) => {
                    if (selectedFeatureDescription?.description === undefined) {
                      return;
                    }

                    if (!selectedFeatureDescription.description.columnId) {
                      return;
                    }

                    void upsertRichtextCellServerAction.execute({
                      type: "richtext",
                      value,
                      rowId: selectedFeatureDescription.rowId,
                      columnId: selectedFeatureDescription.description.columnId,
                    });
                  }}
                  onIconChange={(value) => {
                    if (!selectedFeatureIcon?.icon || !currentPageData) {
                      return;
                    }

                    if (!selectedFeatureIcon.icon.columnId) {
                      return;
                    }

                    void upsertIconCellServerAction.execute({
                      type: "icon",
                      value,
                      rowId: selectedFeatureIcon.rowId,
                      columnId: selectedFeatureIcon.icon.columnId,
                    });
                  }}
                  onTitleChange={(value) => {
                    if (!selectedFeatureTitle?.title) {
                      return;
                    }

                    if (!selectedFeatureTitle.title.columnId) {
                      return;
                    }

                    void upsertStringCellServerAction.execute({
                      type: "string",
                      value,
                      rowId: selectedFeatureTitle.rowId,
                      columnId: selectedFeatureTitle.title.columnId,
                    });
                  }}
                  title={
                    selectedFeatureTitle?.title?.columnId
                      ? selectedFeatureTitle.title.stringCell?.value ?? null
                      : undefined
                  }
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
