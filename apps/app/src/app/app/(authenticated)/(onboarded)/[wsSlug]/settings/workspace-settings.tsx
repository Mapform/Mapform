"use client";

import {
  updateWorkspaceSchema,
  type UpdateWorkspaceSchema,
} from "@mapform/backend/workspaces/update-workspace/schema";
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
import { Button } from "@mapform/ui/components/button";
import { useAction } from "next-safe-action/hooks";
import { updateWorkspaceAction } from "~/data/workspaces/update-workspace";
import { useWorkspace } from "../workspace-context";
import { PenBoxIcon } from "lucide-react";

export function WorkspaceSettings() {
  const { workspaceDirectory } = useWorkspace();
  const form = useForm<UpdateWorkspaceSchema>({
    defaultValues: {
      name: workspaceDirectory.name,
      slug: workspaceDirectory.slug,
      id: workspaceDirectory.id,
    },
    resolver: zodResolver(updateWorkspaceSchema),
  });
  const { execute, isPending } = useAction(updateWorkspaceAction);

  const onSubmit = (values: UpdateWorkspaceSchema) => {
    execute(values);
  };

  return (
    <Form {...form}>
      <form className="flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 pb-8 md:grid-cols-3">
          <div>
            <h2 className="text-md font-semibold">Workspace Settings</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Customize your workspace name and url.
            </p>
          </div>
          <div className="grid-cols-1 md:col-span-2">
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
            <div className="mt-4 flex items-center gap-2">
              <p className="text-muted-foreground text-sm">
                https://alpha.mapform.co/app/{workspaceDirectory.slug}
              </p>
              <Button className="text-sm" size="sm" variant="ghost">
                Edit
              </Button>
            </div>
            {/* <FormField
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
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>
        </div>
        <Button className="ml-auto" disabled={isPending} type="submit">
          Update
        </Button>
      </form>
    </Form>
  );
}
