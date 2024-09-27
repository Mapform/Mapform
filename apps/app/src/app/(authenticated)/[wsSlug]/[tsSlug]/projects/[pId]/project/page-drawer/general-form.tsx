"use client";

import {
  useForm,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
  zodResolver,
  FormDescription,
} from "@mapform/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mapform/ui/components/select";
import { useAction } from "next-safe-action/hooks";
import { useCallback, useEffect } from "react";
import type { PageWithLayers } from "~/data/pages/get-page-with-layers";
import {
  updatePageSchema,
  type UpdatePageSchema,
} from "~/data/pages/update-page/schema";
import { updatePage as updatePageAction } from "~/data/pages/update-page";
import { usePage } from "../../page-context";

interface GeneralFormProps {
  optimisticPage: PageWithLayers;
}

export function GeneralForm({ optimisticPage }: GeneralFormProps) {
  const { updatePage } = usePage();
  const form = useForm<UpdatePageSchema>({
    resolver: zodResolver(updatePageSchema),
    defaultValues: {
      id: optimisticPage.id,
      contentViewType: optimisticPage.contentViewType,
    },
  });

  const { execute, status } = useAction(updatePageAction);

  const onSubmit = useCallback(
    (data: UpdatePageSchema) => {
      if (!data.contentViewType || !optimisticPage.id) {
        return;
      }

      updatePage({
        ...optimisticPage,
        contentViewType: data.contentViewType,
      });

      execute({
        id: optimisticPage.id,
        contentViewType: data.contentViewType,
      });
    },
    [optimisticPage, execute, updatePage]
  );

  useEffect(() => {
    const subscription = form.watch(() => form.handleSubmit(onSubmit)());
    return () => {
      subscription.unsubscribe();
    };
  }, [form, form.handleSubmit, form.watch, onSubmit]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <FormField
            control={form.control}
            name="contentViewType"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="contentViewType">
                  Content View Type
                </FormLabel>
                <FormControl>
                  <Select
                    disabled={status === "executing"}
                    name={field.name}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger className="mt-1.5" id="contentViewType">
                      <SelectValue placeholder="Select a content view type" />
                    </SelectTrigger>
                    <SelectContent ref={field.ref}>
                      <SelectItem className="capitalize" value="split">
                        Split View
                      </SelectItem>
                      <SelectItem className="capitalize" value="map">
                        Map View
                      </SelectItem>
                      <SelectItem className="capitalize" value="text">
                        Text View
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Determines how much space the content drawer takes up.
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
