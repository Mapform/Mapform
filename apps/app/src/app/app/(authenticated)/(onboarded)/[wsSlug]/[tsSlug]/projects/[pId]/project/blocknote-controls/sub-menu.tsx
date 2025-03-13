import { useCallback, useMemo, useState } from "react";
import {
  PropertyPopover,
  PropertyPopoverAnchor,
  PropertyPopoverContent,
} from "~/components/property-popover";
import {
  FieldPath,
  Form,
  FormField,
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
import { createColumnAction } from "~/data/columns/create-column";

interface SubMenuProps {
  type: Column["type"] | null;
  isPropertyPopoverOpen: boolean;
  setIsPropertyPopoverOpen: (open: boolean) => void;
}

const typeToLayerColumnId = {
  string: "titleColumnId",
  richtext: "descriptionColumnId",
  point: "pointColumnId",
  icon: "iconColumnId",
  number: "numberColumnId",
  date: "dateColumnId",
  bool: "boolColumnId",
};

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
    onSuccess: () => {
      toast({
        title: "Layer updated",
        description: "Your property changes have been applied.",
      });
      setIsPropertyPopoverOpen(false);
      setQuery("");
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

  const {
    executeAsync: createColumnAsync,
    isPending: isCreatingColumnPending,
  } = useAction(createColumnAction, {
    onSuccess: ({ data, input }) => {
      if (!data?.id) return;

      if (input.type === "point") {
        form.setValue("markerProperties.pointColumnId", data.id);
      }

      if (input.type === "string") {
        form.setValue("markerProperties.titleColumnId", data.id);
      }

      if (input.type === "richtext") {
        form.setValue("markerProperties.descriptionColumnId", data.id);
      }

      if (input.type === "icon") {
        form.setValue("markerProperties.iconColumnId", data.id);
      }
    },

    onError: () => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was an error creating the column.",
      });
    },
  });

  const fieldName = useMemo(() => {
    let object: "pointProperties" | "markerProperties" | null = null;

    if (selectedFeature?.type === "point") {
      object = "pointProperties";
    } else if (selectedFeature?.type === "marker") {
      object = "markerProperties";
    }

    if (!object || !type) {
      return null;
    }

    return `${object}.${typeToLayerColumnId[type]}` as FieldPath<UpsertLayerSchema>;
  }, [selectedFeature?.type, type]);

  if (!type || !dataset || !fieldName) {
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
          <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <PropertyPopoverContent
                align="start"
                side="right"
                disabled={isCreatingColumnPending || isPending}
                value={field.value as string | null}
                query={query}
                setQuery={setQuery}
                availableItems={availableColumns ?? []}
                onSelect={(value) => {
                  form.setValue(fieldName, value as string | null);
                  void form.handleSubmit(onSubmit)();
                }}
                onCreate={async (name) => {
                  const newColumn = await createColumnAsync({
                    name,
                    datasetId: form.watch("datasetId"),
                    type,
                  });
                  form.setValue(fieldName, newColumn?.data?.id);
                  await form.handleSubmit(onSubmit)();
                }}
              />
            )}
          />
        </PropertyPopover>
      </form>
    </Form>
  );
}
