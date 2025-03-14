"use client";

import { forwardRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverAnchor,
} from "@mapform/ui/components/popover";
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
  const { ...rest } = useProject();

  const currentPage = rest.updatePageServerAction.optimisticState!;

  const form = useForm<UpsertLayerSchema>({
    defaultValues: {
      name: initialName ?? "",
      pageId: currentPage.id,
      ...layerToEdit,
      pointProperties:
        layerToEdit?.type === "point" && layerToEdit.pointLayer
          ? {
              ...layerToEdit.pointLayer,
            }
          : undefined,
      markerProperties:
        layerToEdit?.type === "marker" && layerToEdit.markerLayer
          ? {
              ...layerToEdit.markerLayer,
            }
          : undefined,
    },
    resolver: zodResolver(upsertLayerSchema),
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

  const onSubmit = (values: UpsertLayerSchema) => {
    execute(values);
  };

  const renderProperties = () => {
    const datasetId = form.watch("datasetId");
    const type = form.watch("type");

    if (!datasetId) {
      return null;
    }

    if (type === "point") return <PointProperties form={form} />;

    return <MarkerProperties form={form} />;
  };

  return (
    <PopoverContent ref={ref} {...props}>
      <Form {...form}>
        <form
          className="flex flex-1 flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
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

            {form.watch("datasetId") &&
              form.watch("type") &&
              renderProperties()}

            <Button
              className="col-span-2"
              disabled={isPending || !form.formState.isValid}
              size="sm"
              type="submit"
            >
              {layerToEdit ? "Update Layer" : "Create Layer"}
            </Button>
          </div>
        </form>
      </Form>
    </PopoverContent>
  );
});

LayerPopoverContent.displayName = "LayerPopoverContent";

export {
  Popover as LayerPopoverRoot,
  PopoverTrigger as LayerPopoverTrigger,
  PopoverAnchor as LayerPopoverAnchor,
};
