import { cn } from "@mapform/lib/classnames";
import { Button } from "@mapform/ui/components/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@mapform/ui/components/command";
import {
  FormField,
  FormLabel,
  type UseFormReturn,
} from "@mapform/ui/components/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { toast } from "@mapform/ui/components/toaster";
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import type { UpsertLayerSchema } from "@mapform/backend/data/layers/upsert-layer/schema";
import { createEmptyDatasetAction } from "./actions";
import { useProject } from "../project-context";

interface DatasetPopoverProps {
  form: UseFormReturn<UpsertLayerSchema>;
}

export function DatasetPopover({ form }: DatasetPopoverProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { currentProject, availableDatasets } = useProject();
  const { executeAsync } = useAction(createEmptyDatasetAction, {
    onSuccess: ({ data, input }) => {
      if (!data?.dataset) return;

      toast({
        title: "Success!",
        description: "Your dataset has been created.",
      });
      form.setValue("datasetId", data.dataset.id);

      if (input.layerType === "point" || input.layerType === "marker") {
        form.setValue(
          "pointProperties.pointColumnId",
          data.columns?.find((c) => c.type === "point")?.id ?? "",
        );

        form.setValue(
          "pointProperties.titleColumnId",
          data.columns?.find((c) => c.type === "string")?.id ?? "",
        );

        form.setValue(
          "pointProperties.descriptionColumnId",
          data.columns?.find((c) => c.type === "richtext")?.id ?? "",
        );
      }
    },
  });

  return (
    <FormField
      control={form.control}
      name="datasetId"
      render={({ field }) => (
        <Popover modal onOpenChange={setOpen} open={open}>
          <FormLabel htmlFor="datasetSelect">Dataset</FormLabel>
          <div className="flex justify-end flex-shrink-0 w-full">
            <PopoverTrigger asChild>
              <Button
                className="ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-7 w-full items-center justify-between whitespace-nowrap rounded-md border-0 bg-stone-100 px-2 py-0.5 text-sm font-normal shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
                id="datasetSelect"
                size="icon-xs"
                variant="ghost"
              >
                <span className="flex-1 text-left truncate">
                  {form.watch("datasetId")
                    ? availableDatasets.find(
                        (dataset) => dataset.id === field.value,
                      )?.name
                    : "Select dataset..."}
                </span>
                <ChevronsUpDownIcon className="flex-shrink-0 opacity-50 size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-[200px] p-0"
              side="right"
            >
              <Command
                filter={(value, search, keywords) => {
                  if (value.includes("Create")) return 1;
                  if (
                    value
                      .toLocaleLowerCase()
                      .includes(search.toLocaleLowerCase())
                  )
                    return 1;
                  if (
                    keywords?.some((k) =>
                      k
                        .toLocaleLowerCase()
                        .includes(search.toLocaleLowerCase()),
                    )
                  )
                    return 1;
                  return 0;
                }}
              >
                <CommandInput
                  onValueChange={(v: string) => {
                    setQuery(v);
                  }}
                  placeholder="Search or create..."
                  value={query}
                />
                <CommandList>
                  <CommandGroup>
                    <CommandItem
                      disabled={query.length === 0}
                      onSelect={async () => {
                        await executeAsync({
                          name: query,
                          teamspaceId: currentProject.teamspaceId,
                          layerType: form.watch("type"),
                        });
                        setQuery("");
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center overflow-hidden">
                        <p className="flex items-center font-semibold whitespace-nowrap">
                          <PlusIcon className="mr-2 size-4" />
                          New dataset
                        </p>
                        <p className="block ml-1 truncate text-primary">
                          {query}
                        </p>
                      </div>
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                  {availableDatasets.length > 0 ? (
                    <CommandGroup heading="Connect dataset">
                      {availableDatasets.map((dataset) => (
                        <CommandItem
                          key={dataset.id}
                          keywords={[dataset.name]}
                          onSelect={(currentValue) => {
                            form.setValue(
                              "datasetId",
                              currentValue === field.value ? "" : currentValue,
                            );
                            setOpen(false);
                          }}
                          value={dataset.id}
                        >
                          <span className="flex-1 text-left truncate">
                            {dataset.name}
                          </span>
                          <CheckIcon
                            className={cn(
                              "ml-auto size-4",
                              field.value === dataset.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ) : null}
                </CommandList>
              </Command>
            </PopoverContent>
          </div>
        </Popover>
      )}
    />
  );
}
