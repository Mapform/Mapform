"use client";

import { useForm, zodResolver } from "@mapform/ui/components/form";
import { z } from "zod";
import { useProject } from "../../project-context";
import { Button } from "@mapform/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@mapform/ui/components/form";
import { Input } from "@mapform/ui/components/input";
import { Textarea } from "@mapform/ui/components/textarea";
import { useAction } from "next-safe-action/hooks";
import { updateProjectAction } from "~/data/projects/update-project";
import type { UpdateProjectSchema } from "@mapform/backend/data/projects/update-project/schema";

const formSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
});

export function Settings() {
  const { currentProject } = useProject();

  const form = useForm<UpdateProjectSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentProject.name,
      description: currentProject.description || "",
    },
  });

  const { execute: updateProject, status } = useAction(updateProjectAction);

  const onSubmit = form.handleSubmit((values) => {
    updateProject({
      ...values,
      id: currentProject.id,
    });
  });

  return (
    <div className="space-y-6 px-2">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter project name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter project description"
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={status === "executing"}>
            {status === "executing" ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
