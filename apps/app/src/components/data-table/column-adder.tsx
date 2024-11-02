import { columnTypeEnum } from "@mapform/db/schema";
import { Button } from "@mapform/ui/components/button";
import {
  useForm,
  zodResolver,
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@mapform/ui/components/form";
import { Input } from "@mapform/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@mapform/ui/components/select";
import { PlusIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { createColumn } from "~/data/columns/create-column";
import {
  createColumnSchema,
  type CreateColumnSchema,
} from "~/data/columns/create-column/schema";

interface ColumnAdderProps {
  datasetId: string;
}

export function ColumnAdder({ datasetId }: ColumnAdderProps) {
  const { execute, status } = useAction(createColumn);
  const form = useForm<CreateColumnSchema>({
    defaultValues: {
      datasetId,
    },
    resolver: zodResolver(createColumnSchema),
  });

  const onSubmit = (values: CreateColumnSchema) => {
    execute(values);
  };

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button size="icon-xs" variant="ghost">
          <PlusIcon className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[240px]" side="right">
        <Form {...form}>
          <form
            className="flex flex-1 flex-col"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid auto-cols-auto grid-cols-[auto_1fr] items-center gap-x-6 gap-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <>
                    <FormLabel>Name</FormLabel>
                    <div className="flex-1">
                      <FormControl>
                        <Input
                          disabled={field.disabled}
                          name={field.name}
                          onChange={field.onChange}
                          placeholder="New Column"
                          ref={field.ref}
                          s="sm"
                          value={field.value}
                          variant="filled"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <>
                    <FormLabel htmlFor="layerSelect">Type</FormLabel>
                    <FormControl>
                      <Select
                        name={field.name}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger
                          className="capitalize"
                          id="layerSelect"
                          s="sm"
                          variant="filled"
                        >
                          <SelectValue placeholder="Select type..." />
                        </SelectTrigger>
                        <SelectContent ref={field.ref}>
                          {columnTypeEnum.enumValues.map((type) => (
                            <SelectItem
                              className="capitalize"
                              key={type}
                              value={type}
                            >
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </>
                )}
              />
              <Button
                className="col-span-2"
                disabled={status === "executing" || !form.formState.isValid}
                size="sm"
                type="submit"
              >
                Create
              </Button>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
