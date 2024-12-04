"use client";

import { useState } from "react";
import {
  updateWorkspaceSchema,
  type UpdateWorkspaceSchema,
} from "@mapform/backend/workspaces/update-workspace/schema";
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
import { Input } from "@mapform/ui/components/input";
import { Button } from "@mapform/ui/components/button";
import {
  Alert,
  AlertIcon,
  AlertDescription,
} from "@mapform/ui/components/alert";
import { useAction } from "next-safe-action/hooks";
import { toast } from "@mapform/ui/components/toaster";
import { TriangleAlertIcon } from "lucide-react";
import { updateWorkspaceAction } from "~/data/workspaces/update-workspace";
import { useWorkspace } from "../workspace-context";

export function WorkspaceSettings() {
  const [showSlugField, setShowSlugField] = useState(false);
  const { workspaceDirectory } = useWorkspace();
  const form = useForm<UpdateWorkspaceSchema>({
    defaultValues: {
      name: workspaceDirectory.name,
      slug: workspaceDirectory.slug,
      id: workspaceDirectory.id,
    },
    resolver: zodResolver(updateWorkspaceSchema),
  });
  const { execute, isPending } = useAction(updateWorkspaceAction, {
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your workspace has been updated.",
      });
    },

    onError: (res) => {
      // Set error message
      if (res.error.serverError) {
        form.setError("slug", {
          type: "manual",
          message: res.error.serverError,
        });
      }
    },
  });

  const onSubmit = (values: UpdateWorkspaceSchema) => {
    execute(values);
  };

  return (
    <Form {...form}>
      <form className="flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 pb-8 md:grid-cols-3">
          <div>
            <h2 className="text-md font-semibold">Workspace Settings</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Customize your workspace name and url.
            </p>
          </div>
          <div className="grid-cols-1 space-y-8 md:col-span-2">
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
                      placeholder="My Workspace"
                      ref={field.ref}
                      value={field.value}
                    />
                  </FormControl>
                  {showSlugField ? null : (
                    <FormDescription>
                      https://alpha.mapform.co/app/{workspaceDirectory.slug}
                      <Button
                        className="ml-2 text-sm"
                        onClick={() => {
                          setShowSlugField(true);
                        }}
                        size="sm"
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
            {showSlugField ? (
              <>
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input
                          disabled={field.disabled}
                          name={field.name}
                          onChange={field.onChange}
                          placeholder="my-workspace"
                          ref={field.ref}
                          value={field.value}
                        />
                      </FormControl>
                      <FormDescription>
                        Your slug must be unique and can only contain lowercase
                        letters, numbers, and hyphens.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Alert variant="warning">
                  <AlertIcon icon={TriangleAlertIcon} />
                  <AlertDescription>
                    Editing your workspace URL will change the URL for all your
                    content. Be sure to update any links you&apos;ve shared.
                  </AlertDescription>
                </Alert>
              </>
            ) : null}
          </div>
        </div>
        <Button className="ml-auto" disabled={isPending} type="submit">
          Update
        </Button>
      </form>
    </Form>
  );
}
