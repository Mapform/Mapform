import { Button } from "@mapform/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@mapform/ui/components/dialog";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@mapform/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";

import { useAction } from "next-safe-action/hooks";
import { toast } from "@mapform/ui/components/toaster";
import { Input } from "@mapform/ui/components/input";
import type { GeoJson } from "@infra-blocks/zod-utils/geojson";
import {
  quickCreateDataLayerSchema,
  type QuickCreateDataLayerSchema,
} from "~/data/datalayer/quick-create/schema";
import { quickCreateDataLayer } from "~/data/datalayer/quick-create";
import { usePage } from "../../page-context";
import { DatasetPicker } from "./dataset-picker";

export const QuickCreateDialog = Dialog;
export const QuickCreateDialogTrigger = DialogTrigger;

interface QuickCreateContentProps {
  data: GeoJson;
}

export function QuickCreateContent({ data }: QuickCreateContentProps) {
  const { optimisticPage } = usePage();
  // @ts-ignore -- The type is too complex
  const form = useForm<QuickCreateDataLayerSchema>({
    defaultValues: {
      name: "",
      pageId: optimisticPage?.id,
      data,
    },
    resolver: zodResolver(quickCreateDataLayerSchema),
  });
  const { execute, status } = useAction(quickCreateDataLayer, {
    onError: ({ error }) => {
      if (error.serverError) {
        toast(error.serverError);
        return;
      }

      if (error.validationErrors) {
        toast("There was an error creating the form");
      }
    },
    onSuccess: () => {
      form.reset();
      toast("Your form has been created.");
    },
  });

  const onSubmit = (values: QuickCreateDataLayerSchema) => {
    execute(values);
  };

  return (
    <DialogContent
      onInteractOutside={(e) => {
        e.preventDefault();
      }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Layer Editor</DialogTitle>
            <DialogDescription>
              Create and modify layers to visualize your data on the map.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-6">
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
                      placeholder="My Data Layer"
                      ref={field.ref}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DatasetPicker />
          </div>

          <DialogFooter>
            <Button
              disabled={status === "executing" || !form.formState.isValid}
              type="submit"
            >
              Create
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
