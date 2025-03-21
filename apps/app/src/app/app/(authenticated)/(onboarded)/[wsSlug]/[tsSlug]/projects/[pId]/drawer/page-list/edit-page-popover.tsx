"use client";

import { forwardRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverAnchor,
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
import { Button } from "@mapform/ui/components/button";
import { Input } from "@mapform/ui/components/input";
import { updatePageSchema } from "@mapform/backend/data/pages/update-page/schema";
import type { UpdatePageSchema } from "@mapform/backend/data/pages/update-page/schema";
import { updatePageAction } from "~/data/pages/update-page";
import { Switch } from "@mapform/ui/components/switch";
import type { GetProjectWithPages } from "@mapform/backend/data/projects/get-project-with-pages";

interface EditPagePopoverProps {
  page: NonNullable<GetProjectWithPages["data"]>["pages"][number];
  onSuccess?: () => void;
  onClose?: () => void;
}

export const EditPagePopoverContent = forwardRef<
  React.ElementRef<typeof PopoverContent>,
  React.ComponentPropsWithoutRef<typeof PopoverContent> & EditPagePopoverProps
>(({ page, onSuccess, onClose, ...props }, ref) => {
  const form = useForm<UpdatePageSchema>({
    defaultValues: {
      id: page.id,
      title: page.title ?? "",
      contentViewType: page.contentViewType,
    },
    resolver: zodResolver(updatePageSchema),
  });

  const { execute, isPending } = useAction(updatePageAction, {
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your page has been updated.",
      });
      onSuccess?.();
      onClose?.();
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
        description: "There was an error updating the page.",
      });
    },
  });

  const onSubmit = (values: UpdatePageSchema) => {
    execute(values);
  };

  return (
    <PopoverContent ref={ref} {...props}>
      <Form {...form}>
        <form
          className="flex flex-1 flex-col gap-y-3"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-[77px_minmax(0,1fr)] items-center gap-x-6 gap-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <>
                  <FormLabel>Title</FormLabel>
                  <div className="flex-1">
                    <FormControl>
                      <Input
                        autoComplete="off"
                        data-lpignore="true"
                        data-1p-ignore
                        disabled={field.disabled}
                        name={field.name}
                        onChange={field.onChange}
                        placeholder="Page Title"
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
          </div>

          <FormField
            control={form.control}
            name="contentViewType"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <FormLabel className="flex items-center gap-x-2">
                    Show Content
                  </FormLabel>
                  <FormDescription>
                    Display the map with content on the side.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value === "split"}
                    onCheckedChange={(checked) => {
                      field.onChange(checked ? "split" : "map");
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            className="col-span-2"
            disabled={isPending || !form.formState.isValid}
            size="sm"
            type="submit"
          >
            Update Page
          </Button>
        </form>
      </Form>
    </PopoverContent>
  );
});

EditPagePopoverContent.displayName = "EditPagePopoverContent";

export {
  Popover as EditPagePopoverRoot,
  PopoverTrigger as EditPagePopoverTrigger,
  PopoverAnchor as EditPagePopoverAnchor,
};
