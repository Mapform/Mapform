"use client";

import {
  updateWorkspaceSchema,
  type UpdateWorkspaceSchema,
} from "@mapform/backend/workspaces/update-workspace/schema";
import { Form, useForm, zodResolver } from "@mapform/ui/components/form";
import { useWorkspace } from "../workspace-context";

export function WorkspaceSettings() {
  const { workspaceDirectory } = useWorkspace();
  const form = useForm<UpdateWorkspaceSchema>({
    defaultValues: {
      name: "",
      slug: "",
      id: workspaceDirectory.id,
    },
    resolver: zodResolver(updateWorkspaceSchema),
  });

  const onSubmit = (values: UpdateWorkspaceSchema) => {};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>Test</form>
    </Form>
  );
}
