import { MapformDrawer } from "~/components/mapform";
import { Blocknote } from "~/components/mapform/block-note";
import { BlocknoteControls } from "./blocknote-controls";
import { useProject } from "../../project-context";
import { toast } from "@mapform/ui/components/toaster";
import type { InferSafeActionFnInput } from "next-safe-action";
import { upsertCellAction } from "~/data/cells/upsert-cell";
import { useDebouncedOptimisticAction } from "~/lib/use-debounced-optimistic-action";
import type { GetFeature } from "@mapform/backend/data/features/get-feature";

type LayerFeature = NonNullable<GetFeature["data"]>;

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
        <FeatureDrawerInner key={selectedFeature.properties.rowId} />
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
    LayerFeature | undefined,
    InferSafeActionFnInput<typeof upsertCellAction>["clientInput"]
  >(upsertCellAction, {
    currentState: selectedFeature,
    updateFn: (
      state: unknown,
      payload: InferSafeActionFnInput<typeof upsertCellAction>["clientInput"],
    ) => {
      const typedState = state as LayerFeature | undefined;
      if (!typedState) return state;

      return {
        ...typedState,
        properties: {
          ...typedState.properties,
          icon: {
            columnId: payload.columnId,
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
    LayerFeature | undefined,
    InferSafeActionFnInput<typeof upsertCellAction>["clientInput"]
  >(upsertCellAction, {
    currentState: selectedFeature,
    updateFn: (
      state: unknown,
      payload: InferSafeActionFnInput<typeof upsertCellAction>["clientInput"],
    ) => {
      const typedState = state as LayerFeature | undefined;
      if (
        !typedState ||
        !typedState.properties.title ||
        payload.type !== "string"
      )
        return state;

      return {
        ...typedState,
        properties: {
          ...typedState.properties,
          title: {
            columnId: payload.columnId,
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
    LayerFeature | undefined,
    InferSafeActionFnInput<typeof upsertCellAction>["clientInput"]
  >(upsertCellAction, {
    currentState: selectedFeature,
    updateFn: (
      state: unknown,
      payload: InferSafeActionFnInput<typeof upsertCellAction>["clientInput"],
    ) => {
      const typedState = state as LayerFeature | undefined;
      if (
        !typedState ||
        !typedState.properties.description ||
        payload.type !== "richtext"
      )
        return state;

      return {
        ...typedState,
        properties: {
          ...typedState.properties,
          description: {
            columnId: payload.columnId,
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

  if (
    !selectedFeature ||
    !selectedFeatureIcon ||
    !selectedFeatureTitle ||
    !selectedFeatureDescription
  ) {
    return null;
  }

  return (
    <Blocknote
      isFeature
      controls={
        <BlocknoteControls
          allowAddEmoji={
            !!selectedFeature.properties.icon?.columnId &&
            !!selectedFeature.properties.icon.value
          }
          onIconChange={(value) => {
            if (
              !selectedFeatureIcon.properties.icon ||
              !updateFeaturesServerAction.optimisticState
            ) {
              return;
            }

            if (!selectedFeatureIcon.properties.icon.columnId) {
              return;
            }

            void upsertIconCellServerAction.execute({
              type: "icon",
              value,
              rowId: selectedFeatureIcon.properties.rowId,
              columnId: selectedFeatureIcon.properties.icon.columnId,
            });
          }}
        />
      }
      description={
        selectedFeatureDescription.properties.description?.columnId
          ? selectedFeatureDescription.properties.description.value ?? null
          : undefined
      }
      icon={
        selectedFeatureIcon.properties.icon?.columnId
          ? selectedFeatureIcon.properties.icon.value ?? null
          : undefined
      }
      key={`${currentPage.id}-${selectedFeatureIcon.properties.rowId}-${selectedFeatureDescription.properties.description?.columnId}`}
      onDescriptionChange={(value) => {
        if (
          !selectedFeatureDescription.properties.description ||
          !selectedFeatureDescription.properties.description.columnId
        ) {
          return;
        }

        if (!selectedFeatureDescription.properties.description.columnId) {
          return;
        }

        void upsertRichtextCellServerAction.execute({
          type: "richtext",
          value,
          rowId: selectedFeatureDescription.properties.rowId,
          columnId: selectedFeatureDescription.properties.description.columnId,
        });
      }}
      onIconChange={(value) => {
        if (
          !selectedFeatureIcon.properties.icon ||
          !updateFeaturesServerAction.optimisticState
        ) {
          return;
        }

        if (!selectedFeatureIcon.properties.icon.columnId) {
          return;
        }

        void upsertIconCellServerAction.execute({
          type: "icon",
          value,
          rowId: selectedFeatureIcon.properties.rowId,
          columnId: selectedFeatureIcon.properties.icon.columnId,
        });
      }}
      onTitleChange={(value) => {
        if (!selectedFeatureTitle.properties.title) {
          return;
        }

        if (!selectedFeatureTitle.properties.title.columnId) {
          return;
        }

        void upsertStringCellServerAction.execute({
          type: "string",
          value,
          rowId: selectedFeatureTitle.properties.rowId,
          columnId: selectedFeatureTitle.properties.title.columnId,
        });
      }}
      title={
        selectedFeatureTitle.properties.title?.columnId
          ? selectedFeatureTitle.properties.title.value ?? null
          : undefined
      }
    />
  );
}
