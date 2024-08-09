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
} from "@mapform/ui/components/form";
import { toast } from "@mapform/ui/components/toaster";
import { useAction } from "next-safe-action/hooks";
import { useDebounce } from "@mapform/lib/use-debounce";
import type { StepWithLocation } from "@mapform/db/extentsions/steps";
import { useCallback, useEffect } from "react";
import { Input } from "@mapform/ui/components/input";
import { updateDataTrack } from "~/data/datatracks/update-datatrack";
import {
  updateDataTrackSchema,
  type UpdateDataTrackSchema,
} from "~/data/datatracks/update-datatrack/schema";
import type { FormWithSteps } from "~/data/forms/get-form-with-steps";

interface GeneralFormProps {
  currentDataTrack: NonNullable<FormWithSteps["data"]>["dataTracks"][number];
}

export function GeneralForm({ currentDataTrack }: GeneralFormProps) {
  const form = useForm<UpdateDataTrackSchema>({
    resolver: zodResolver(updateDataTrackSchema),
    defaultValues: {
      datatrackId: currentDataTrack.id,
      name: currentDataTrack.name ?? "",
    },
  });
  // const updateFormState = (step: StepWithLocation) => {
  //   form.setValue("data", step);
  // };
  // const debouncedUpdateFormState = useDebounce(updateFormState, 500);

  const { execute } = useAction(updateDataTrack, {
    onSuccess: () => {
      toast("Step settings updated ✅");
    },
    onError: () => {
      toast("There was an issue updating the step settings.");
    },
  });

  const onSubmit = useCallback(
    (data: UpdateDataTrackSchema) => {
      if (!currentDataTrack.formId) {
        throw new Error("Form ID is required.");
      }

      console.log(11111, data);

      execute({
        datatrackId: data.datatrackId,
        name: data.name,
      });
    },
    [currentDataTrack, execute]
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
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={field.disabled}
                    name={field.name}
                    onChange={field.onChange}
                    placeholder="My datatrack"
                    ref={field.ref}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
