"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
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
import { toast } from "@mapform/ui/components/toaster";
import { useAction } from "next-safe-action/hooks";
import { Input } from "@mapform/ui/components/input";
import { Button } from "@mapform/ui/components/button";
import { ChevronDown, ChevronsUpDownIcon } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@mapform/ui/components/select";
import { createLayerSchema } from "~/data/layers/create-layer/schema";
import type { CreateLayerSchema } from "~/data/layers/create-layer/schema";
import { createLayer } from "~/data/layers/create-layer";
import { usePage } from "../page-context";
import { DatasetPopover } from "./dataset-popover";
import { TypePopover } from "./type-popover";
import { PointProperties } from "./point-properties";

interface LayerPopoverProps {
  // The trigger
  children: React.ReactNode;
}

export function LayerPopover({ children }: LayerPopoverProps) {
  const { availableDatasets, ...rest } = usePage();
  const optimisticPage = rest.optimisticPage!;

  const form = useForm<CreateLayerSchema>({
    defaultValues: {
      pageId: optimisticPage.id,
      type: "point",
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
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
