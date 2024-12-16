import type { UpdateProjectSchema } from "@mapform/backend/data/projects/update-project/schema";
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
import { updateProjectAction } from "~/data/projects/update-project";

interface RenameProjectPopoverContentProps {
  project: {
    id: string;
    title: string;
  };
  children?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

export function RenameProjectPopover({
  project,
  children,
  onOpenChange,
  open,
}: RenameProjectPopoverContentProps) {
  const { executeAsync, status } = useAction(updateProjectAction);
  const form = useForm<UpdateProjectSchema>({
    defaultValues: {
      name: project.title,
    },
  });

  /**
   * This will trigger on enter
   */
  const onSubmit = async (values: UpdateProjectSchema) => {
    if (values.name !== project.title) {
      await executeAsync({
        id: project.id,
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
          if (values.name !== project.title) {
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
                      disabled={field.disabled || status === "executing"}
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
