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
import { createForm } from "./actions";
import { createFormSchema, type CreateFormSchema } from "./schema";

export function CreateDialog({ workspaceId }: { workspaceId: string }) {
  const form = useForm<CreateFormSchema>({
    defaultValues: {
      name: "",
      workspaceId,
    },
    mode: "onChange",
    resolver: zodResolver(createFormSchema),
  });

  const onSubmit = async (values: CreateFormSchema) => {
    const { serverError, validationErrors } = await createForm(values);

    if (serverError) {
      toast(serverError);
      return;
    }

    if (validationErrors) {
      toast("There was an error creating the form");
      return;
    }

    form.reset();

    toast("Your form has been created.");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Form</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create Form</DialogTitle>
              <DialogDescription>Create a new form</DialogDescription>
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
