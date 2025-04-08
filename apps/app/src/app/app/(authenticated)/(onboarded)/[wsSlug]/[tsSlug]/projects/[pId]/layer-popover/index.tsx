"use client";

import { forwardRef, useCallback } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverAnchor,
} from "@mapform/ui/components/popover";
import type { UseFormReturn } from "@mapform/ui/components/form";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  useForm,
  zodResolver,
} from "@mapform/ui/components/form";
import { toast } from "@mapform/ui/components/toaster";
import { useAction } from "next-safe-action/hooks";
import { Button } from "@mapform/ui/components/button";
import { Input } from "@mapform/ui/components/input";
import { upsertLayerSchema } from "@mapform/backend/data/layers/upsert-layer/schema";
import type { UpsertLayerSchema } from "@mapform/backend/data/layers/upsert-layer/schema";
import type { GetPageWithLayers } from "@mapform/backend/data/pages/get-page-with-layers";
import { upsertLayerAction } from "~/data/layers/upsert-layer";
import { useProject } from "../project-context";
import { PointProperties } from "./point-properties";
import { DatasetPopover } from "./dataset-popover";
import { TypePopover } from "./type-popover";
import { MarkerProperties } from "./marker-properties";
import type { Column } from "@mapform/db/schema";

interface LayerPopoverProps {
  initialName?: string;
  layerToEdit?: NonNullable<
    GetPageWithLayers["data"]
  >["layersToPages"][number]["layer"];
  onSuccess?: (layerId: string) => void;
  onClose?: () => void;
}

export const LayerPopoverContent = forwardRef<
  React.ElementRef<typeof PopoverContent>,
  React.ComponentPropsWithoutRef<typeof PopoverContent> & LayerPopoverProps
>(({ layerToEdit, initialName, onSuccess, onClose, ...props }, ref) => {
  const { availableDatasets } = useProject();
  const form = useForm<Pick<UpsertLayerSchema, "name" | "type" | "datasetId">>({
    defaultValues: {
      name: initialName ?? layerToEdit?.name ?? "",
      type: layerToEdit?.type ?? "marker",
      datasetId: layerToEdit?.datasetId,
    },
    resolver: zodResolver(
      upsertLayerSchema.pick({ name: true, type: true, datasetId: true }),
    ),
  });

  return (
    <PopoverContent ref={ref} {...props}>
      <Form {...form}>
        <form
          className="flex flex-1 flex-col"
          // onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-[77px_minmax(0,1fr)] items-center gap-x-6 gap-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <>
                  <FormLabel>Name</FormLabel>
                  <div className="flex-1">
                    <FormControl>
                      <Input
                        autoComplete="off"
                        data-lpignore="true"
                        data-1p-ignore
                        disabled={field.disabled}
                        name={field.name}
                        onChange={field.onChange}
                        placeholder="New Layer"
                        ref={field.ref}
                        s="sm"
                        value={field.value ?? ""}
                        variant="filled"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </>
              )}
            />

            <TypePopover form={form} />

            {form.watch("type") && <DatasetPopover form={form} />}
          </div>
        </form>
        {form.watch("datasetId") && form.watch("type") && (
          <PropertiesForm
            // Re-render when selected or available datasets change. We don't
            // want to re-render for type because point and marker share the
            // same properties (This makes it easier to quickly update from one
            // to the other with the same properties set). This may change in
            // the future though as more types are added.
            key={`${form.watch("datasetId")}-${availableDatasets.length}`}
            parentForm={form}
            layerToEdit={layerToEdit}
            onSuccess={onSuccess}
            onClose={onClose}
          />
        )}
      </Form>
    </PopoverContent>
  );
});

LayerPopoverContent.displayName = "LayerPopoverContent";

interface PropertiesFormProps {
  layerToEdit?: NonNullable<
    GetPageWithLayers["data"]
  >["layersToPages"][number]["layer"];
  onSuccess?: (layerId: string) => void;
  onClose?: () => void;
  parentForm: UseFormReturn<
    Pick<UpsertLayerSchema, "name" | "type" | "datasetId">
  >;
}
const PropertiesForm = ({
  layerToEdit,
  onSuccess,
  onClose,
  parentForm,
}: PropertiesFormProps) => {
  const { availableDatasets, ...rest } = useProject();
  const currentPage = rest.updatePageServerAction.optimisticState!;
  const currentDatasetId = parentForm.watch("datasetId");
  const currentType = parentForm.watch("type");
  const currentDataset = availableDatasets.find(
    (ds) => ds.id === currentDatasetId,
  );

  const getAvailableColumns = useCallback(
    (t: Column["type"]) => {
      if (!currentDataset || !currentType) {
        return null;
      }

      return currentDataset.columns.filter((column) => {
        return column.type === t;
      });
    },
    [currentDataset, currentType],
  );

  const getLastAvailableColumnId = (type: Column["type"]) => {
    const columns = getAvailableColumns(type);
    return columns?.[columns.length - 1]?.id;
  };

  const form = useForm<Omit<UpsertLayerSchema, "name" | "type" | "datasetId">>({
    defaultValues: {
      id: layerToEdit?.id,
      pageId: currentPage.id,
      pointProperties:
        currentType === "point"
          ? layerToEdit?.datasetId === currentDatasetId &&
            layerToEdit.pointLayer
            ? {
                ...layerToEdit.pointLayer,
              }
            : {
                pointColumnId: getLastAvailableColumnId("point"),
                color: null,
              }
          : undefined,
      markerProperties:
        currentType === "marker"
          ? layerToEdit?.datasetId === currentDatasetId &&
            layerToEdit.markerLayer
            ? {
                ...layerToEdit.markerLayer,
              }
            : {
                pointColumnId: getLastAvailableColumnId("point"),
                titleColumnId: getLastAvailableColumnId("string"),
                descriptionColumnId: getLastAvailableColumnId("richtext"),
                iconColumnId: getLastAvailableColumnId("icon"),
                color: null,
              }
          : undefined,
    },
    resolver: zodResolver(
      upsertLayerSchema.omit({ name: true, type: true, datasetId: true }),
    ),
  });

  const { execute, isPending } = useAction(upsertLayerAction, {
    onSuccess: ({ data }) => {
      if (onSuccess && data?.id) {
        onSuccess(data.id);
        onClose?.();
        return;
      }

      toast({
        title: "Success!",
        description: layerToEdit
          ? "Your layer has been updated."
          : "Your layer has been created.",
      });
      onClose?.();
    },
    onError: ({ error }) => {
      if (error.serverError) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: error.serverError,
        });
        return;
      }

      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was an error creating the layer.",
      });
    },
  });

  const onSubmit = (
    values: Omit<UpsertLayerSchema, "name" | "type" | "datasetId">,
  ) => {
    execute({
      ...values,
      ...parentForm.getValues(),
    });
  };

  return (
    <form
      className="flex w-full flex-1 flex-col"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-[77px_minmax(0,1fr)] items-center gap-x-6 gap-y-3">
        {parentForm.watch("type") === "point" ? (
          <PointProperties
            form={form}
            datasetId={parentForm.watch("datasetId")}
            type={parentForm.watch("type")}
          />
        ) : null}
        {parentForm.watch("type") === "marker" ? (
          <MarkerProperties
            form={form}
            datasetId={parentForm.watch("datasetId")}
            type={parentForm.watch("type")}
          />
        ) : null}

        <Button
          className="col-span-2"
          disabled={
            isPending ||
            !form.formState.isValid ||
            !parentForm.formState.isValid
          }
          size="sm"
          type="submit"
        >
          {layerToEdit ? "Update Layer" : "Create Layer"}
        </Button>
      </div>
    </form>
  );
};

PropertiesForm.displayName = "PropertiesForm";

export {
  Popover as LayerPopoverRoot,
  PopoverTrigger as LayerPopoverTrigger,
  PopoverAnchor as LayerPopoverAnchor,
};
