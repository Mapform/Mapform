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
  FormDescription,
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
import {
  createProjectSchema,
  type CreateProjectSchema,
} from "@mapform/backend/data/projects/create-project/schema";
import { createProjectAction } from "~/data/projects/create-project";
import { useWorkspace } from "~/app/app/(authenticated)/(onboarded)/[wsSlug]/workspace-context";
import { useRouter } from "next/navigation";
import { Switch } from "@mapform/ui/components/switch";

interface CreateProjectDialogProps {
  tsSlug: string;
  children: React.ReactNode;
}

export function CreateProjectDialog({
  tsSlug,
  children,
}: CreateProjectDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { workspaceDirectory } = useWorkspace();
  const teamspace = workspaceDirectory.teamspaces.find(
    (ts) => ts.slug === tsSlug,
  );
  const form = useForm<CreateProjectSchema>({
    defaultValues: {
      name: "",
      teamspaceId: teamspace?.id,
    },
    resolver: zodResolver(createProjectSchema),
  });
  const { execute, status } = useAction(createProjectAction, {
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
          description: "There was an error creating the project",
        });
      }
    },
    onSuccess: ({ data }) => {
      form.reset();
      toast({
        title: "Success!",
        description: "Your project has been created.",
      });
      setOpen(false);

      router.push(
        `/app/${workspaceDirectory.slug}/${teamspace?.slug}/projects/${data?.id}`,
      );
    },
  });

  const onSubmit = (values: CreateProjectSchema) => {
    execute(values);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
                        autoComplete="off"
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
              <FormField
                control={form.control}
                name="formsEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Enable Forms</FormLabel>
                      <FormDescription>
                        Collect data from user inputs and enable interactive
                        experiences.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
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
