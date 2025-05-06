import { MapformDrawer } from "~/components/mapform";
import { Blocknote } from "~/components/mapform/block-note";
import { BlocknoteControls } from "./blocknote-controls";
import { useProject } from "../../project-context";
import { toast } from "@mapform/ui/components/toaster";
import type { InferSafeActionFnInput } from "next-safe-action";
import { upsertCellAction } from "~/data/cells/upsert-cell";
import { useDebouncedOptimisticAction } from "~/lib/use-debounced-optimistic-action";
import type { GetLayerFeature } from "@mapform/backend/data/features/get-full-feature";

type LayerFeature = NonNullable<GetLayerFeature["data"]>;

export function FeatureDrawer() {
  const { selectedFeature, setSelectedFeature } = useProject();

  return (
    <MapformDrawer
      onClose={() => {
        setSelectedFeature(undefined);
      }}
      value="feature"
    >
      {selectedFeature ? (
        <FeatureDrawerInner key={selectedFeature.rowId} />
      ) : null}
    </MapformDrawer>
  );
}

function FeatureDrawerInner() {
  const {
    selectedFeature,
    updatePageServerAction,
    updateFeaturesServerAction,
  } = useProject();
  const currentPage = updatePageServerAction.optimisticState;

  const upsertIconCellServerAction = useDebouncedOptimisticAction<
    LayerFeature,
    InferSafeActionFnInput<typeof upsertCellAction>["clientInput"]
  >(upsertCellAction, {
    currentState: selectedFeature,
    updateFn: (
      state: unknown,
      payload: InferSafeActionFnInput<typeof upsertCellAction>["clientInput"],
    ) => {
      const typedState = state as LayerFeature | undefined;
      if (!typedState || !typedState.icon || payload.type !== "icon")
        return state;

      return {
        ...typedState,
        icon: {
          ...typedState.icon,
          iconCell: {
            ...typedState.icon.iconCell,
            value: payload.value,
          },
        },
      };
    },
    onError: () => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "We we unable to update your content. Please try again.",
      });
    },
  });

  const upsertStringCellServerAction = useDebouncedOptimisticAction<
    LayerFeature,
    InferSafeActionFnInput<typeof upsertCellAction>["clientInput"]
  >(upsertCellAction, {
    currentState: selectedFeature,
    updateFn: (
      state: unknown,
      payload: InferSafeActionFnInput<typeof upsertCellAction>["clientInput"],
    ) => {
      const typedState = state as LayerFeature | undefined;
      if (!typedState || !typedState.title || payload.type !== "string")
        return state;

      return {
        ...typedState,
        title: {
          ...typedState.title,
          stringCell: {
            ...typedState.title.stringCell,
            value: payload.value,
          },
        },
      };
    },
    onError: () => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "We we unable to update your content. Please try again.",
      });
    },
  });

  const upsertRichtextCellServerAction = useDebouncedOptimisticAction<
    LayerFeature,
    InferSafeActionFnInput<typeof upsertCellAction>["clientInput"]
  >(upsertCellAction, {
    currentState: selectedFeature,
    updateFn: (
      state: unknown,
      payload: InferSafeActionFnInput<typeof upsertCellAction>["clientInput"],
    ) => {
      const typedState = state as LayerFeature | undefined;
      if (!typedState || !typedState.description || payload.type !== "richtext")
        return state;

      return {
        ...typedState,
        description: {
          ...typedState.description,
          richtextCell: {
            ...typedState.description.richtextCell,
            value: payload.value,
          },
        },
      };
    },
    onError: () => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "We we unable to update your content. Please try again.",
      });
    },
  });

  const selectedFeatureIcon = upsertIconCellServerAction.optimisticState;
  const selectedFeatureTitle = upsertStringCellServerAction.optimisticState;
  const selectedFeatureDescription =
    upsertRichtextCellServerAction.optimisticState;

  if (!currentPage) {
    return null;
  }

  if (!selectedFeature) {
    return null;
  }

  return (
    <Blocknote
      isFeature
      controls={
        <BlocknoteControls
          allowAddEmoji={
            !!selectedFeatureIcon.icon?.columnId &&
            !selectedFeatureIcon.icon.iconCell?.value
          }
          onIconChange={(value) => {
            if (
              !selectedFeatureIcon.icon ||
              !updateFeaturesServerAction.optimisticState
            ) {
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
        selectedFeatureDescription.description?.columnId
          ? selectedFeatureDescription.description.richtextCell?.value ?? null
          : undefined
      }
      icon={
        selectedFeatureIcon.icon?.columnId
          ? selectedFeatureIcon.icon.iconCell?.value ?? null
          : undefined
      }
      key={`${currentPage.id}-${selectedFeatureIcon.rowId}-${selectedFeatureDescription.description?.columnId}`}
      onDescriptionChange={(value) => {
        if (selectedFeatureDescription.description === undefined) {
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
        if (
          !selectedFeatureIcon.icon ||
          !updateFeaturesServerAction.optimisticState
        ) {
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
        if (!selectedFeatureTitle.title) {
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
        selectedFeatureTitle.title?.columnId
          ? selectedFeatureTitle.title.stringCell?.value ?? null
          : undefined
      }
    />
  );
}
