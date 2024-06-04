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
import { createWorkspace } from "~/server/actions/workspaces/create";
import {
  createWorkspaceSchema,
  type CreateWorkspaceSchema,
} from "~/server/actions/workspaces/create/schema";

export function CreateDialog({
  organizationSlug,
  disabled = false,
}: {
  organizationSlug: string;
  disabled?: boolean;
}) {
  const form = useForm<CreateWorkspaceSchema>({
    defaultValues: {
      name: "",
      organizationSlug,
    },
    mode: "onChange",
    resolver: zodResolver(createWorkspaceSchema),
  });

  const onSubmit = async (values: CreateWorkspaceSchema) => {
    if (disabled) return;

    const { serverError, validationErrors } = await createWorkspace(values);

    if (serverError) {
      toast(serverError);
      return;
    }

    if (validationErrors) {
      toast("There was an error creating the workspace");
      return;
    }

    form.reset();

    toast("Your workspace has been created.");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disabled} variant="outline">
          Create Workspace
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create Workspace</DialogTitle>
              <DialogDescription>Create a new team workspace</DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
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
                        ref={field.ref}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="sm:justify-start">
              <Button
                disabled={
                  form.formState.isSubmitting || !form.formState.isValid
                }
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
