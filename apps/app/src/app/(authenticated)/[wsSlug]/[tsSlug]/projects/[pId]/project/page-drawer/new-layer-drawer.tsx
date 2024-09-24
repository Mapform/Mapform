"use client";

import {
  NestedDrawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@mapform/ui/components/drawer";
import { Button } from "@mapform/ui/components/button";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@mapform/ui/components/select";
import { ChevronsLeftIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { Input } from "@mapform/ui/components/input";
import { toast } from "@mapform/ui/components/toaster";
import {
  type CreateLayerSchema,
  createLayerSchema,
} from "~/data/layers/create-layer/schema";
import { createLayer } from "~/data/layers/create-layer";
import { usePage } from "../../page-context";

export const NewLayerDrawerRoot = NestedDrawer;

export const NewLayerDrawerTrigger = DrawerTrigger;

export function NewLayerDrawerContent() {
  const { availableDatasets, ...rest } = usePage();
  const optimisticPage = rest.optimisticPage!;

  const form = useForm<CreateLayerSchema>({
    defaultValues: {
      pageId: optimisticPage.id,
    },
    resolver: zodResolver(createLayerSchema),
  });
  const { execute, status } = useAction(createLayer, {
    onSuccess: () => {
      toast("Layer created successfully.");
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
    const dataset = availableDatasets.find((ds) => ds.id === datasetId);

    if (!dataset || !type) {
      return null;
    }

    return dataset.columns.filter((column) => {
      return column.type === type;
    });
  };

  const availableCols = getAvailableColumns();

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
                        value={field.value ?? ""}
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
                          {availableDatasets.map((dataset) => (
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

              {form.watch("type") === "point" && availableCols ? (
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
