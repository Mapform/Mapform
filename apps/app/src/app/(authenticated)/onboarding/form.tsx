"use client";

import { Button } from "@mapform/ui/components/button";
import { Input } from "@mapform/ui/components/input";
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
import { toast } from "@mapform/ui/components/toaster";
import { useAction } from "next-safe-action/hooks";
import {
  completeOnboardingSchema,
  type CompleteOnboardingSchema,
} from "@mapform/backend/onboarding/complete-onboarding/schema";
import { completeOnboardingAction } from "~/data/onboarding/complete-onboarding";

export function OnboardingForm() {
  const form = useForm<CompleteOnboardingSchema>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(completeOnboardingSchema),
  });

  const { execute, status } = useAction(completeOnboardingAction, {
    onSuccess: () => {
      toast("Your account has been created. Welcome to Mapform! 🎉");
    },
    onError: ({ error }) => {
      if (error.serverError) {
        toast(error.serverError);
        return;
      }

      if (error.validationErrors) {
        toast("There was an error creating your account");
      }
    },
  });

  return (
    <Form {...form}>
      <form
        className="text-left"
        onSubmit={form.handleSubmit((data) => {
          execute(data);
        })}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>What&apos;s your name?</FormLabel>
              <FormControl>
                <Input
                  className="bg-white"
                  disabled={field.disabled}
                  name={field.name}
                  onChange={field.onChange}
                  placeholder="Jane Doe"
                  ref={field.ref}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="mt-8 w-full"
          disabled={status === "executing" || !form.formState.isValid}
          type="submit"
        >
          {status === "executing"
            ? "Creating your account..."
            : "Create account"}
        </Button>
      </form>
    </Form>
  );
}
