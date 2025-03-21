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
  FormField,
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

interface EditPagePopoverProps {
  pageId: string;
  initialTitle?: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export const EditPagePopoverContent = forwardRef<
  React.ElementRef<typeof PopoverContent>,
  React.ComponentPropsWithoutRef<typeof PopoverContent> & EditPagePopoverProps
>(({ pageId, initialTitle, onSuccess, onClose, ...props }, ref) => {
  const form = useForm<UpdatePageSchema>({
    defaultValues: {
      id: pageId,
      title: initialTitle ?? "",
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
          className="flex flex-1 flex-col"
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

            <Button
              className="col-span-2"
              disabled={isPending || !form.formState.isValid}
              size="sm"
              type="submit"
            >
              Update Page
            </Button>
          </div>
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
