"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
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
import { Input } from "@mapform/ui/components/input";
import { Button } from "@mapform/ui/components/button";
import { upsertLayerSchema } from "~/data/layers/upsert-layer/schema";
import type { UpsertLayerSchema } from "~/data/layers/upsert-layer/schema";
import { upsertLayer } from "~/data/layers/upsert-layer";
import type { PageWithLayers } from "~/data/pages/get-page-with-layers";
import { usePage } from "../page-context";
import { DatasetPopover } from "./dataset-popover";
import { TypePopover } from "./type-popover";
import { PointProperties } from "./point-properties";

interface LayerPopoverProps {
  // The trigger
  children: React.ReactNode;
  // Puts form into edit mode
  layerToEdit?: PageWithLayers["layersToPages"][number]["layer"];
}

export function LayerPopover({ children, layerToEdit }: LayerPopoverProps) {
  const { ...rest } = usePage();
  const optimisticPage = rest.optimisticPage!;

  const form = useForm<UpsertLayerSchema>({
    defaultValues: {
      pageId: optimisticPage.id,
      type: "point",
      ...layerToEdit,
      pointProperties: layerToEdit?.pointLayer
        ? {
            ...layerToEdit.pointLayer,
          }
        : undefined,
    },
    resolver: zodResolver(upsertLayerSchema),
  });
  const { execute, status } = useAction(upsertLayer, {
    onSuccess: () => {
      toast(
        layerToEdit
          ? "Layer updated successfully."
          : "Layer created successfully.",
      );
    },
    onError: ({ error }) => {
      if (error.serverError) {
        toast(error.serverError);
        return;
      }

      toast("There was an error creating the layer.");
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
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form
            className="flex flex-1 flex-col"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid auto-cols-auto grid-cols-[auto_1fr] items-center gap-x-6 gap-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <>
                    <FormLabel>Name</FormLabel>
                    <div className="flex-1">
                      <FormControl>
                        <Input
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

              <DatasetPopover form={form} />

              {renderProperties()}

              <Button
                className="col-span-2"
                disabled={status === "executing" || !form.formState.isValid}
                size="sm"
                type="submit"
              >
                {layerToEdit ? "Update Layer" : "Create Layer"}
              </Button>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
