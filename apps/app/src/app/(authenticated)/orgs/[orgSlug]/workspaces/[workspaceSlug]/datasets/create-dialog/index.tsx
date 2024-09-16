"use client";

import { parse } from "papaparse";
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
import { useState } from "react";
import { Input } from "@mapform/ui/components/input";
import { toast } from "@mapform/ui/components/toaster";
import { useAction } from "next-safe-action/hooks";
import type { CreateDatasetFromCSVSchema } from "~/data/datasets/create-from-csv/schema";
import { createDatasetFromCSVSchema } from "~/data/datasets/create-from-csv/schema";
import { createDatasetFromCSV } from "~/data/datasets/create-from-csv";

export function CreateDialog({
  workspaceId,
  disabled,
}: {
  workspaceId: string;
  disabled?: boolean;
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const form = useForm<CreateDatasetFromCSVSchema>({
    defaultValues: {
      name: "",
      workspaceId,
    },
    mode: "onChange",
    resolver: zodResolver(createDatasetFromCSVSchema),
  });
  const { execute, status } = useAction(createDatasetFromCSV, {
    onError: ({ error }) => {
      if (error.serverError) {
        toast(error.serverError);
        return;
      }

      if (error.validationErrors) {
        toast("There was an error creating the form");
      }
    },
    onSuccess: () => {
      form.reset();
      toast("Your form has been created.");
      setIsDrawerOpen(false);
    },
  });

  const onSubmit = (values: CreateDatasetFromCSVSchema) => {
    if (disabled) return;

    execute(values);
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      toast("There was an error uploading the file.");
      return;
    }
    parse(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        form.setValue("data", results.data as Record<string, string>[]);
        void form.trigger("data");
      },
    });
  };

  return (
    <Dialog onOpenChange={setIsDrawerOpen} open={isDrawerOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} size="sm" variant="outline">
          Create Dataset
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create Dataset</DialogTitle>
              <DialogDescription>
                Upload geospatial data to be used in your Mapforms.
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
              <FormField
                control={form.control}
                name="data"
                render={() => (
                  <FormItem className="flex-1">
                    <FormLabel>File</FormLabel>
                    <FormControl>
                      <Input
                        accept=".csv"
                        className="bg-white"
                        onChange={onFileChange}
                        type="file"
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
                {status === "executing" ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
