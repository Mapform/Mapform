import { Button } from "@mapform/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useAction } from "next-safe-action/hooks";
import { toast } from "@mapform/ui/components/toaster";
import { Input } from "@mapform/ui/components/input";
import {
  quickCreateDataLayerSchema,
  type QuickCreateDataLayerSchema,
} from "~/data/datalayer/quick-create/schema";
import { quickCreateDataLayer } from "~/data/datalayer/quick-create";

export const QuickCreateDialog = Dialog;
export const QuickCreateDialogTrigger = DialogTrigger;

interface QuickCreateContentProps {
  stepId: string;
  formId: string;
}

export function QuickCreateContent({
  stepId,
  formId,
}: QuickCreateContentProps) {
  const form = useForm<QuickCreateDataLayerSchema>({
    defaultValues: {
      name: "",
      stepId,
      formId,
    },
    resolver: zodResolver(quickCreateDataLayerSchema),
  });
  const { execute, status } = useAction(quickCreateDataLayer, {
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

  const onSubmit = (values: QuickCreateDataLayerSchema) => {
    execute(values);
  };

  return (
    <DialogContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Quick Create</DialogTitle>
            <DialogDescription>
              Create a new dataset and layer with basic presets
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
                      placeholder="My Data Layer"
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
  );
}
