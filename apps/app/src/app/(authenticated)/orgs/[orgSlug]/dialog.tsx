"use client";

import { Button } from "@mapform/ui/components/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@mapform/ui/components/dialog";
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
import { Input } from "@mapform/ui/components/input";
import { toast } from "@mapform/ui/components/toaster";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { createWorkspace } from "~/data/workspaces/create";
import {
  createWorkspaceSchema,
  type CreateWorkspaceSchema,
} from "~/data/workspaces/create/schema";

export function CreateDialog({
  organizationSlug,
  disabled = false,
}: {
  organizationSlug: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateWorkspaceSchema>({
    defaultValues: {
      name: "",
      organizationSlug,
    },
    mode: "onChange",
    resolver: zodResolver(createWorkspaceSchema),
  });
  const { execute, status } = useAction(createWorkspace, {
    onError: ({ error }) => {
      if (error.serverError) {
        toast(error.serverError);
        return;
      }

      if (error.validationErrors) {
        toast("There was an error creating the workspace");
      }
    },
    onSuccess: () => {
      form.reset();
      toast("Your workspace has been created.");
      setOpen(false);
    },
  });

  const onSubmit = (values: CreateWorkspaceSchema) => {
    if (disabled) return;

    execute(values);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button disabled={disabled} size="sm" variant="outline">
          Create Workspace
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create Workspace</DialogTitle>
              <DialogDescription>
                Workspaces are where your teams organize forms and datasets.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-6">
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                disabled={status === "executing" || !form.formState.isValid}
                type="submit"
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
