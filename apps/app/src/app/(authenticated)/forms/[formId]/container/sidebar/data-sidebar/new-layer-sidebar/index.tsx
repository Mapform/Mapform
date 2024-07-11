import { Button } from "@mapform/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
  zodResolver,
} from "@mapform/ui/components/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@mapform/ui/components/select";
import { ArrowLeftIcon } from "lucide-react";
import {
  type CreateLayerSchema,
  createLayerSchema,
} from "~/server/actions/layers/create/schema";

interface NewLayerSidebarProps {
  setShowNewLayerSidebar: (show: boolean) => void;
}

export function NewLayerSidebar({
  setShowNewLayerSidebar,
}: NewLayerSidebarProps) {
  const form = useForm<CreateLayerSchema>({
    defaultValues: {
      name: "",
    },
    mode: "onChange",
    resolver: zodResolver(createLayerSchema),
  });

  const onSubmit = async (values: CreateLayerSchema) => {
    // const { serverError, validationErrors } = await createOrg(values);
    // if (serverError) {
    //   toast(serverError);
    //   return;
    // }
    // if (validationErrors) {
    //   toast("There was an error creating the organization");
    //   return;
    // }
    // form.reset();
    // toast("Your organization has been created.");
  };

  return (
    <div className="absolute inset-0 bg-white z-10">
      <div className="p-4 border-b">
        <Button
          onClick={() => {
            setShowNewLayerSidebar(false);
          }}
          size="sm"
          variant="secondary"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" /> Close
        </Button>
      </div>
      <div className="p-4">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {/* DATASET */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="layerType">Dataset</FormLabel>
                  <FormControl>
                    <Select
                      disabled={status === "executing"}
                      name={field.name}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="mt-1.5" id="layerType">
                        <SelectValue placeholder="Select a dataset" />
                      </SelectTrigger>
                      <SelectContent ref={field.ref}>
                        <SelectItem className="capitalize" value="POINT">
                          Point
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TYPE */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="layerType">Layer Type</FormLabel>
                  <FormControl>
                    <Select
                      disabled={status === "executing"}
                      name={field.name}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="mt-1.5" id="layerType">
                        <SelectValue placeholder="Select a layer type" />
                      </SelectTrigger>
                      <SelectContent ref={field.ref}>
                        <SelectItem className="capitalize" value="POINT">
                          Point
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Choose how the data should be represented.
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}
