"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { usePage } from "./page-context";
import {
  Form,
  FormControl,
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
            <div className="grid grid-cols-[auto_1fr] gap-6 auto-cols-auto items-center">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={field.disabled}
                        name={field.name}
                        onChange={field.onChange}
                        placeholder="New Layer"
                        ref={field.ref}
                        value={field.value ?? ""}
                        s="sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </>
                )}
              />
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
