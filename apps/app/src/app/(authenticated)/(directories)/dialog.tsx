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
import { createOrg } from "~/data/orgs/create";
import {
  createOrgSchema,
  type CreateOrgSchema,
} from "~/data/orgs/create/schema";

export function CreateDialog() {
  const form = useForm<CreateOrgSchema>({
    defaultValues: {
      name: "",
    },
    mode: "onChange",
    resolver: zodResolver(createOrgSchema),
  });

  const onSubmit = async (values: CreateOrgSchema) => {
    const { serverError, validationErrors } = await createOrg(values);

    if (serverError) {
      toast(serverError);
      return;
    }

    if (validationErrors) {
      toast("There was an error creating the organization");
      return;
    }

    form.reset();

    toast("Your organization has been created.");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Organization</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create Organization</DialogTitle>
              <DialogDescription>
                Create a new organization to group your workspaces.
              </DialogDescription>
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
