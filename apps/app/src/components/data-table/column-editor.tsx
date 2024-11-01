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
import { Trash2Icon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { editColumn } from "~/data/columns/edit-column";
import { deleteColumn } from "~/data/columns/delete-column";
import {
  editColumnSchema,
  type EditColumnSchema,
} from "~/data/columns/edit-column/schema";

interface ColumnEditorProps {
  columnId: string;
  children: React.ReactNode;
}

export function ColumnEditor({ columnId, children }: ColumnEditorProps) {
  const { execute, status } = useAction(deleteColumn);
  const { execute: executeEditColumn, status: statusEditColumn } =
    useAction(editColumn);
  const form = useForm<EditColumnSchema>({
    defaultValues: {
      id: columnId,
    },
    resolver: zodResolver(editColumnSchema),
  });

  const onSubmit = (values: EditColumnSchema) => {
    execute(values);
  };

  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
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
              <Button
                className="col-span-2"
                disabled={status === "executing"}
                onClick={() => {
                  execute({ id: columnId });
                }}
                size="sm"
                type="button"
                variant="ghost"
              >
                <Trash2Icon className="mr-2 size-4" /> Delete
              </Button>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
