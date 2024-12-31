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
import {
  createEmptyDatasetSchema,
  type CreateEmptyDatasetSchema,
} from "@mapform/backend/data/datasets/create-empty-dataset/schema";
import { createEmptyDatasetAction } from "~/data/datasets/create-empty-dataset";
import { useWorkspace } from "~/app/app/(authenticated)/(onboarded)/[wsSlug]/workspace-context";
import { useRouter } from "next/navigation";

interface CreateDatasetDialogProps {
  tsSlug: string;
  children: React.ReactNode;
}

export function CreateDatasetDialog({
  tsSlug,
  children,
}: CreateDatasetDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { workspaceDirectory } = useWorkspace();
  const teamspace = workspaceDirectory.teamspaces.find(
    (ts) => ts.slug === tsSlug,
  );
  const form = useForm<CreateEmptyDatasetSchema>({
    defaultValues: {
      name: "",
      teamspaceId: teamspace?.id,
    },
    resolver: zodResolver(createEmptyDatasetSchema),
  });
  const { execute, status } = useAction(createEmptyDatasetAction, {
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
          description: "There was an error creating the dataset",
        });
      }
    },
    onSuccess: ({ data }) => {
      form.reset();
      toast({
        title: "Success!",
        description: "Your dataset has been created.",
      });
      setOpen(false);

      router.push(
        `/app/${workspaceDirectory.slug}/${teamspace?.slug}/datasets/${data?.dataset?.id}`,
      );
    },
  });

  const onSubmit = (values: CreateEmptyDatasetSchema) => {
    execute(values);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create Dataset</DialogTitle>
              <DialogDescription>
                Store geospatial and tabular data for your projects.
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
                        placeholder="My Dataset"
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
