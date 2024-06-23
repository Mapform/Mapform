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
import { Button } from "@mapform/ui/components/button";
import { useAction } from "next-safe-action/hooks";
import {
  type UpdateStepSchema,
  updateStepSchema,
} from "~/server/actions/steps/update/schema";
import { updateStep } from "~/server/actions/steps/update";

interface GeneralFormProps {
  stepId: string;
}

export function GeneralForm({ stepId }: GeneralFormProps) {
  const form = useForm<UpdateStepSchema>({
    resolver: zodResolver(updateStepSchema),
    defaultValues: {
      stepId,
    },
  });

  const { execute, status } = useAction(updateStep, {
    onSuccess: () => {
      toast("Location updated ✅");
    },
    onError: () => {
      toast("There was an issue updating the location");
    },
  });

  const onSubmit = (data: UpdateStepSchema) => {
    execute({
      stepId,
      data: data.data,
    });
  };

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
                    name={field.name}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger className="mt-1.5" id="contentViewType">
                      <SelectValue placeholder="Select a content view type" />
                    </SelectTrigger>
                    <SelectContent ref={field.ref}>
                      <SelectItem className="capitalize" value="Full">
                        Full
                      </SelectItem>
                      <SelectItem className="capitalize" value="PARTIAL">
                        Partial
                      </SelectItem>
                      <SelectItem className="capitalize" value="HIDDEM">
                        Hidden
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
