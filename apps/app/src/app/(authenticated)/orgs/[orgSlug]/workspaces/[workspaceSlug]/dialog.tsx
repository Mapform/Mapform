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
import { createForm } from "~/data/forms/create";
import {
  createFormSchema,
  type CreateFormSchema,
} from "~/data/forms/create/schema";

export function CreateDialog({
  workspaceId,
  disabled,
}: {
  workspaceId: string;
  disabled?: boolean;
}) {
  const form = useForm<CreateFormSchema>({
    defaultValues: {
      name: "",
      workspaceId,
    },
    mode: "onChange",
    resolver: zodResolver(createFormSchema),
  });
  const { execute } = useAction(createForm, {
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
    },
  });

  const onSubmit = (values: CreateFormSchema) => {
    if (disabled) return;

    execute(values);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disabled} size="sm" variant="outline">
          Create Form
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create MapForm</DialogTitle>
              <DialogDescription>
                Make your new map-based experience.
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