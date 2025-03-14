import type { UpdateDatasetSchema } from "@mapform/backend/data/datasets/update-dataset/schema";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  useForm,
} from "@mapform/ui/components/form";
import { Input } from "@mapform/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { useAction } from "next-safe-action/hooks";
import { Fragment } from "react";
import { updateDatasetAction } from "./actions";

interface RenameDatasetPopoverContentProps {
  dataset: {
    id: string;
    title: string;
  };
  children?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

export function RenameDatasetPopover({
  dataset,
  children,
  onOpenChange,
  open,
}: RenameDatasetPopoverContentProps) {
  const { executeAsync, isPending } = useAction(updateDatasetAction);
  const form = useForm<UpdateDatasetSchema>({
    defaultValues: {
      name: dataset.title,
    },
  });

  /**
   * This will trigger on enter
   */
  const onSubmit = async (values: UpdateDatasetSchema) => {
    if (values.name !== dataset.title) {
      await executeAsync({
        id: dataset.id,
        name: values.name,
      });
    }
    onOpenChange?.(false);
  };

  const ConditionalTrigger =
    onOpenChange !== undefined ? Fragment : PopoverTrigger;

  return (
    <Popover
      modal
      onOpenChange={async (val) => {
        if (!val) {
          const values = form.getValues();
          if (values.name !== dataset.title) {
            return onSubmit(values);
          }
        }
        onOpenChange?.(val);
      }}
      open={open}
    >
      <PopoverContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      autoComplete="off"
                      data-lpignore="true"
                      data-1p-ignore
                      disabled={field.disabled || isPending}
                      name={field.name}
                      onChange={field.onChange}
                      ref={field.ref}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </PopoverContent>
      <PopoverAnchor>
        <ConditionalTrigger>{children}</ConditionalTrigger>
      </PopoverAnchor>
    </Popover>
  );
}
