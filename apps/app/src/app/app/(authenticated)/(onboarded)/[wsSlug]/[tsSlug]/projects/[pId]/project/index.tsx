"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { compressImage } from "~/lib/compress-image";
import { useProject } from "../project-context";
import {
  MapformContent,
  MapformDrawer,
  MapformDrawerButton,
} from "~/components/mapform";
import { CustomBlockProvider, type CustomBlock } from "@mapform/blocknote";
import { Blocknote } from "~/components/mapform/block-note";
import { LocationSearchDrawer } from "./location-search-drawer";
import { Form as DummyForm, useForm } from "@mapform/ui/components/form";
import { BlocknoteControls } from "./page-blocknote-controls";
import { FeatureDrawer } from "./feature-drawer";
import { useAuth } from "~/app/root-providers";
import { updateCurrentUserAction } from "~/data/users/update-current-user";
import { useAction } from "next-safe-action/hooks";
import {
  ProjectTour,
  ProjectTourContent,
} from "~/components/tours/project-tour";
import { EditBar } from "./edit-bar";
import { Map } from "~/components/mapform/map";

function Project() {
  const {
    selectedFeature,
    projectWithPages,
    setSelectedFeature,
    updatePageServerAction,
    uploadImageServerAction,
    updateFeaturesServerAction,
    setIsDrawerStackOpen,
    drawerValues,
    setActiveMode,
  } = useProject();
  const { user } = useAuth();
  const [isTourOpen, setIsTourOpen] = useState(!user?.projectGuideCompleted);

  // This is just used to prevent the input blocks from throwing an error when
  // calling useFormContext
  const dummyForm = useForm();

  const currentPage = updatePageServerAction.optimisticState;

  const { execute: updateCurrentUser } = useAction(updateCurrentUserAction);

  if (!currentPage) {
    return null;
  }

  return (
    <>
      <DummyForm {...dummyForm}>
        <div className="flex flex-1 justify-center overflow-hidden p-4">
          <div className="flex flex-1">
            <MapformContent isEditing drawerValues={drawerValues}>
              <CustomBlockProvider
                isEditing
                imageBlock={{
                  onImageUpload: async (file: File) => {
                    const compressedFile = await compressImage(
                      file,
                      0.9,
                      2000,
                      2000,
                      1000,
                    );
                    const formData = new FormData();
                    formData.append("image", compressedFile);
                    formData.append(
                      "workspaceId",
                      projectWithPages.teamspace.workspace.id,
                    );

                    const response =
                      await uploadImageServerAction.executeAsync(formData);

                    console.log("Image upload response", response);

                    if (response?.serverError) {
                      return null;
                    }

                    return response?.data?.url || null;
                  },
                }}
              >
                <MapformDrawer
                  onClose={() => {
                    setIsDrawerStackOpen(false);
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
                <LocationSearchDrawer
                  currentPage={currentPage}
                  onClose={() => setActiveMode("hand")}
                />
              </CustomBlockProvider>
              {currentPage.contentViewType === "split" ? (
                <MapformDrawerButton
                  onDrawerStackOpenChange={setIsDrawerStackOpen}
                />
              ) : null}
              <Map
                isStatic={false}
                selectedFeature={selectedFeature}
                setSelectedFeature={setSelectedFeature}
                updateFeaturesServerAction={updateFeaturesServerAction}
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
              </Map>
            </MapformContent>
          </div>
        </div>
      </DummyForm>
      <ProjectTour
        open={isTourOpen}
        onOpenChange={(open) => {
          setIsTourOpen(open);
          if (!open) {
            void updateCurrentUser({
              projectGuideCompleted: true,
            });
          }
        }}
      >
        <ProjectTourContent className="fixed bottom-0 right-0" />
      </ProjectTour>
    </>
  );
}

// This is to avoid SSR caused by Blocknote / Tiptap
export default dynamic(() => Promise.resolve(Project), { ssr: false });
