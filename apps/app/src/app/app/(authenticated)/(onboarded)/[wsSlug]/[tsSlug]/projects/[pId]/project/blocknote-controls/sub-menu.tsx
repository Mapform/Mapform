import { useCallback, useState } from "react";
import {
  PropertyPopover,
  PropertyPopoverAnchor,
  PropertyPopoverContent,
} from "~/components/property-popover";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  useForm,
  zodResolver,
} from "@mapform/ui/components/form";
import {
  upsertLayerSchema,
  type UpsertLayerSchema,
} from "@mapform/backend/data/layers/upsert-layer/schema";
import type { Column } from "@mapform/db/schema";
import { toast } from "@mapform/ui/components/toaster";
import { useAction } from "next-safe-action/hooks";
import { upsertLayerAction } from "~/data/cells/submit-page";
import { useProject } from "../../project-context";

interface SubMenuProps {
  type: Column["type"] | null;
  isPropertyPopoverOpen: boolean;
  setIsPropertyPopoverOpen: (open: boolean) => void;
}

export function SubMenu({
  type,
  isPropertyPopoverOpen,
  setIsPropertyPopoverOpen,
}: SubMenuProps) {
  const [query, setQuery] = useState("");
  const { updatePageServerAction, selectedFeature, availableDatasets } =
    useProject();
  const layer = updatePageServerAction.optimisticState?.layersToPages.find(
    (ltp) => ltp.layer.id === selectedFeature?.layerId,
  );
  const dataset = availableDatasets.find(
    (ds) => ds.id === layer?.layer.datasetId,
  );

  const getAvailableColumns = useCallback(
    (t: Column["type"]) => {
      if (!dataset || !type) {
        return null;
      }

      return dataset.columns.filter((column) => {
        return column.type === t;
      });
    },
    [dataset, type],
  );

  const form = useForm<UpsertLayerSchema>({
    defaultValues: {
      name: layer?.layer.name,
      pageId: updatePageServerAction.optimisticState?.id,
      ...layer?.layer,
      pointProperties:
        layer?.layer.type === "point" && layer.layer.pointLayer
          ? {
              ...layer.layer.pointLayer,
            }
          : undefined,
      markerProperties:
        layer?.layer.type === "marker" && layer.layer.markerLayer
          ? {
              ...layer.layer.markerLayer,
            }
          : undefined,
    },
    resolver: zodResolver(upsertLayerSchema),
  });

  const { execute, isPending } = useAction(upsertLayerAction, {
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

  if (!type || !dataset) {
    return null;
  }

  const availableColumns = getAvailableColumns(type);

  const onSubmit = (values: UpsertLayerSchema) => {
    execute(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <PropertyPopover
          modal
          open={isPropertyPopoverOpen}
          onOpenChange={setIsPropertyPopoverOpen}
        >
          <PropertyPopoverAnchor />
          <PropertyPopoverContent
            align="start"
            side="right"
            value={null}
            query={query}
            setQuery={setQuery}
            availableItems={availableColumns ?? []}
            onSelect={(value) => {
              // form.setValue(name, value as string | null);
              // setOpen(false);
            }}
            onCreate={async (name) => {
              // await executeAsync({
              //   name,
              //   datasetId: form.watch("datasetId"),
              //   type,
              // });
              // setQuery("");
              // setOpen(false);
            }}
          />
        </PropertyPopover>
      </form>
    </Form>
  );
}
