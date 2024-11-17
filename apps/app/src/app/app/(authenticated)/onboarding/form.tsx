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
import { signOutAction } from "~/data/auth/sign-out";
import { completeOnboardingAction } from "~/data/onboarding/complete-onboarding";

interface OnboardingFormProps {
  email: string;
}

export function OnboardingForm({ email }: OnboardingFormProps) {
  const form = useForm<CompleteOnboardingSchema>({
    defaultValues: {
      userName: "",
      workspaceName: "",
    },
    resolver: zodResolver(completeOnboardingSchema),
  });

  const { execute, status } = useAction(completeOnboardingAction, {
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your account has been created. Welcome to Mapform! 🎉",
      });
    },
    onError: ({ error }) => {
      if (error.serverError) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: error.serverError,
        });
        return;
      }

      if (error.validationErrors) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was an error creating your account",
        });
      }
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          className="space-y-4 text-left"
          onSubmit={form.handleSubmit((data) => {
            execute(data);
          })}
        >
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Your full name</FormLabel>
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
          <FormField
            control={form.control}
            name="workspaceName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Workspace name</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white"
                    disabled={field.disabled}
                    name={field.name}
                    onChange={field.onChange}
                    placeholder="Acme Inc."
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
      <p className="text-muted-foreground text-sm">
        You are creating an account for {email}. If meant to login to another
        account,{" "}
        <button
          className="link"
          onClick={() => {
            void signOutAction();
          }}
          type="button"
        >
          logout here.
        </button>
      </p>
    </>
  );
}
