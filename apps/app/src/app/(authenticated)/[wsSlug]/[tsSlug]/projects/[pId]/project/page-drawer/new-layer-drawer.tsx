"use client";

import {
  NestedDrawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@mapform/ui/components/drawer";
import { Button } from "@mapform/ui/components/button";
import { Skeleton } from "@mapform/ui/components/skeleton";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
  zodResolver,
} from "@mapform/ui/components/form";
import { useParams } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@mapform/ui/components/select";
import type { Layer } from "@mapform/db";
import { ChevronsLeftIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAction } from "next-safe-action/hooks";
import { Input } from "@mapform/ui/components/input";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "@mapform/ui/components/toaster";
import {
  type CreateLayerSchema,
  createLayerSchema,
} from "~/data/layers/create/schema";
import { listAvailableDatasets } from "~/data/datasets/list-available";
import { createLayer } from "~/data/layers/create";
import { useProject } from "../../project-context";

export const NewLayerDrawerRoot = NestedDrawer;

export const NewLayerDrawerTrigger = DrawerTrigger;

export function NewLayerDrawerContent() {
  const { currentStep } = useProject();
  const params = useParams<{ formId: string }>();
  const form = useForm<CreateLayerSchema>({
    defaultValues: {
      formId: params.formId,
      stepId: currentStep?.id,
    },
    resolver: zodResolver(createLayerSchema),
  });
  const { data, isLoading } = useQuery({
    queryKey: ["datasets", params.formId],
    queryFn: () => listAvailableDatasets({ formId: params.formId }),
  });
  const { execute, status } = useAction(createLayer, {
    onSuccess: ({ data: createResponse }) => {
      if (!createResponse) {
        return;
      }

      setDragLayers((layers) => [...layers, createResponse]);
    },
    onError: ({ error }) => {
      if (error.serverError) {
        toast(error.serverError);
        return;
      }

      toast("There was an error creating the layer.");
    },
  });

  const onSubmit = (values: CreateLayerSchema) => {
    execute(values);
  };

  // If Dataset and Type are selected, get the columns for the dataset
  const getAvailableColumns = () => {
    const type = form.watch("type");
    const datasetId = form.watch("datasetId");
    const dataset = data?.data?.find((ds) => ds.id === datasetId);

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- This won't be an issue when more types are added
    if (!dataset || !type) {
      return null;
    }

    return dataset.columns.filter((column) => {
      return column.dataType === type;
    });
  };

  const availableCols = getAvailableColumns();

  if (isLoading) {
    return (
      <div className="absolute inset-0 bg-white z-10 p-4">
        <Skeleton className="w-full h-8" />
      </div>
    );
  }

  return (
    <DrawerContent>
      <DrawerHeader className="flex justify-between items-center py-2">
        <h2 className="text-base font-medium">Edit Layer</h2>
        <div className="-mr-2">
          <DrawerTrigger asChild>
            <Button size="icon-sm" variant="ghost">
              <ChevronsLeftIcon className="h-4 w-4" />
            </Button>
          </DrawerTrigger>
        </div>
      </DrawerHeader>
      <div className="p-4 flex flex-col flex-1">
        <Form {...form}>
          <form
            className="flex flex-col flex-1"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-6">
              {/* NAME */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={field.disabled}
                        name={field.name}
                        onChange={field.onChange}
                        placeholder="New Layer"
                        ref={field.ref}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DATASET */}
              <FormField
                control={form.control}
                name="datasetId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="dataset">Dataset</FormLabel>
                    <FormControl>
                      <Select
                        name={field.name}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="mt-1.5" id="dataset">
                          <SelectValue placeholder="Select a dataset" />
                        </SelectTrigger>
                        <SelectContent ref={field.ref}>
                          {data?.data?.map((dataset) => (
                            <SelectItem key={dataset.id} value={dataset.id}>
                              {dataset.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* TYPE */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="layerType">Layer Type</FormLabel>
                    <FormControl>
                      <Select
                        name={field.name}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="mt-1.5" id="layerType">
                          <SelectValue placeholder="Select a layer type" />
                        </SelectTrigger>
                        <SelectContent ref={field.ref}>
                          <SelectItem className="capitalize" value="POINT">
                            Point
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Choose how the data should be represented.
                    </FormDescription>
                  </FormItem>
                )}
              />

              {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- This will not be needed once we add more types */}
              {form.watch("type") === "POINT" && availableCols ? (
                <FormField
                  control={form.control}
                  name="pointColumnId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="latitudeColumn">
                        Point Column
                      </FormLabel>
                      <FormControl>
                        <Select
                          name={field.name}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="mt-1.5" id="latitudeColumn">
                            <SelectValue placeholder="Select a column" />
                          </SelectTrigger>
                          <SelectContent ref={field.ref}>
                            {availableCols.map((column) => (
                              <SelectItem key={column.id} value={column.id}>
                                {column.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}
            </div>

            <Button
              className="mt-auto"
              disabled={!form.formState.isValid || status === "executing"}
              type="submit"
            >
              Create
            </Button>
          </form>
        </Form>
      </div>
    </DrawerContent>
  );
}
