"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { usePage } from "../page-context";
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
  CreateLayerSchema,
  createLayerSchema,
} from "~/data/layers/create-layer/schema";
import { toast } from "@mapform/ui/components/toaster";
import { useAction } from "next-safe-action/hooks";
import { createLayer } from "~/data/layers/create-layer";
import { Input } from "@mapform/ui/components/input";
import { DatasetPopover } from "./dataset-popover";
import { Button } from "@mapform/ui/components/button";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@mapform/ui/components/select";
import { TypePopover } from "./type-popover";

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

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form
            className="flex flex-col flex-1"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 auto-cols-auto items-center">
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
                          value={field.value ?? ""}
                          variant="filled"
                          s="sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </>
                )}
              />

              <FormLabel>Type</FormLabel>
              <TypePopover form={form} />

              <FormLabel>Dataset</FormLabel>
              <div className="flex w-full flex-shrink-0 justify-end">
                <DatasetPopover>
                  <Button
                    className="basis-[min-content] px-2"
                    size="icon-xs"
                    variant="ghost"
                  >
                    Dataset <ChevronDown className="size-4 ml-2" />
                  </Button>
                </DatasetPopover>
              </div>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
