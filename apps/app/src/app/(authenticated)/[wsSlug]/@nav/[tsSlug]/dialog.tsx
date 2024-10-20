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
import { createProject } from "~/data/projects/create-project";
import {
  createProjectSchema,
  type CreateProjectSchema,
} from "~/data/projects/create-project/schema";
import { useRootLayout } from "../../root-layout/context";

export function CreateDialog({ tsSlug }: { tsSlug: string }) {
  const [open, setOpen] = useState(false);
  const { workspaceDirectory } = useRootLayout();
  const teamspaceId = workspaceDirectory?.teamspaces.find(
    (ts) => ts.slug === tsSlug,
  )?.id;
  const form = useForm<CreateProjectSchema>({
    defaultValues: {
      name: "",
      teamspaceId,
    },
    resolver: zodResolver(createProjectSchema),
  });
  const { execute, status } = useAction(createProject, {
    onError: ({ error }) => {
      if (error.serverError) {
        toast(error.serverError);
        return;
      }

      if (error.validationErrors) {
        toast("There was an error creating the project");
      }
    },
    onSuccess: () => {
      form.reset();
      toast("Your project has been created.");
      setOpen(false);
    },
  });

  const onSubmit = (values: CreateProjectSchema) => {
    execute(values);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm">Create Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
              <DialogDescription>
                Collect and display location data with a new project.
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
                        placeholder="My MapForm"
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
