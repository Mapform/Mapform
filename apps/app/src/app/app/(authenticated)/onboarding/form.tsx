"use client";

import slugify from "slugify";
import { useState } from "react";
import { Button } from "@mapform/ui/components/button";
import { Input } from "@mapform/ui/components/input";
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
import {
  completeOnboardingSchema,
  type CompleteOnboardingSchema,
} from "@mapform/backend/data/workspaces/complete-onboarding/schema";
import { signOutAction } from "~/data/auth/sign-out";
import { completeOnboardingAction } from "~/data/workspaces/complete-onboarding";
import { env } from "~/env.mjs";
import { cn } from "@mapform/lib/classnames";

interface OnboardingFormProps {
  email: string;
}

export function OnboardingForm({ email }: OnboardingFormProps) {
  const [showSlugField, setShowSlugField] = useState(false);
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
      console.error(123, error);
      if (error.serverError === "Workspace slug already exists") {
        form.setError("workspaceSlug", {
          type: "manual",
          message: error.serverError,
        });
        return;
      }

      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was an error creating your account",
      });
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          className="space-y-6 text-left"
          onSubmit={form.handleSubmit((data) => {
            form.clearErrors();
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
                    onChange={(e) => {
                      field.onChange(e);
                      if (!showSlugField) {
                        form.setValue(
                          "workspaceSlug",
                          slugify(e.currentTarget.value, {
                            lower: true,
                            strict: true,
                          }),
                        );
                      }
                    }}
                    placeholder="Acme Inc."
                    ref={field.ref}
                    value={field.value}
                  />
                </FormControl>
                {showSlugField ? null : (
                  <FormDescription>
                    {env.NEXT_PUBLIC_BASE_URL}/app/{form.watch("workspaceSlug")}
                    <Button
                      className="ml-2 text-sm"
                      onClick={() => {
                        setShowSlugField(true);
                      }}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      Edit
                    </Button>
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="workspaceSlug"
            render={({ field }) => (
              <FormItem
                className={cn("flex-1", {
                  "!m-0": !showSlugField,
                })}
              >
                {showSlugField ? (
                  <>
                    <FormLabel>URL Slug</FormLabel>
                    <FormControl>
                      <Input
                        disabled={field.disabled}
                        name={field.name}
                        onChange={field.onChange}
                        placeholder="acme-inc"
                        ref={field.ref}
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      Your slug must be unique and can only contain lowercase
                      letters, numbers, and hyphens.
                    </FormDescription>
                  </>
                ) : null}
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
