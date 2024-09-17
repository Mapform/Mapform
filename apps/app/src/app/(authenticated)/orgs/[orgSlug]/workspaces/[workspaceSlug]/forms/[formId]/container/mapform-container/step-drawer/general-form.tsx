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
import { toast } from "@mapform/ui/components/toaster";
import { useAction } from "next-safe-action/hooks";
import { useDebounce } from "@mapform/lib/hooks/use-debounce";
import type { StepWithLocation } from "@mapform/db/extentsions/steps";
import { useCallback, useEffect } from "react";
import {
  type UpdateStepSchema,
  updateStepSchema,
} from "~/data/steps/update/schema";
import { updateStep } from "~/data/steps/update";

interface GeneralFormProps {
  currentStep: StepWithLocation;
}

export function GeneralForm({ currentStep }: GeneralFormProps) {
  const form = useForm<UpdateStepSchema>({
    resolver: zodResolver(updateStepSchema),
    defaultValues: {
      stepId: currentStep.id,
      data: {
        contentViewType: currentStep.contentViewType,
      },
    },
  });
  const updateFormState = (step: StepWithLocation) => {
    form.setValue("data", step);
  };
  const debouncedUpdateFormState = useDebounce(updateFormState, 500);

  const { execute, status } = useAction(updateStep, {
    onSuccess: () => {
      toast("Step settings updated ✅");
    },
    onError: () => {
      toast("There was an issue updating the step settings.");
    },
  });

  const onSubmit = useCallback(
    (data: UpdateStepSchema) => {
      execute({
        stepId: currentStep.id,
        data: {
          contentViewType: data.data.contentViewType,
          formId: currentStep.formId ?? undefined,
        },
      });
    },
    [currentStep, execute]
  );

  useEffect(() => {
    const subscription = form.watch(() => form.handleSubmit(onSubmit)());
    return () => {
      subscription.unsubscribe();
    };
  }, [form, form.handleSubmit, form.watch, onSubmit]);

  useEffect(() => {
    // debouncedUpdateFormState(currentStep);
  }, [currentStep, debouncedUpdateFormState]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <FormField
            control={form.control}
            name="data.contentViewType"
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
                      <SelectItem className="capitalize" value="SPLIT">
                        Split View
                      </SelectItem>
                      <SelectItem className="capitalize" value="MAP">
                        Map View
                      </SelectItem>
                      <SelectItem className="capitalize" value="TEXT">
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
