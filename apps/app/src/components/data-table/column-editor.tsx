import { useState } from "react";
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
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { Trash2Icon } from "lucide-react";
import type { Column } from "@mapform/db/schema";
import { useAction } from "next-safe-action/hooks";
import { editColumn } from "~/data/columns/edit-column";
import { deleteColumn } from "~/data/columns/delete-column";
import { COLUMN_ICONS } from "~/constants/column-icons";
import {
  editColumnSchema,
  type EditColumnSchema,
} from "~/data/columns/edit-column/schema";

interface ColumnEditorProps {
  columnId: string;
  columnName: string;
  columnType: Column["type"];
}

export function ColumnEditor({
  columnId,
  columnName,
  columnType,
}: ColumnEditorProps) {
  const Icon = COLUMN_ICONS[columnType];
  const [open, setOpen] = useState(false);
  const { execute, status } = useAction(deleteColumn);
  const { execute: executeEditColumn } = useAction(editColumn);
  const form = useForm<EditColumnSchema>({
    defaultValues: {
      id: columnId,
      name: columnName,
    },
    resolver: zodResolver(editColumnSchema),
  });

  const onSubmit = (values: EditColumnSchema) => {
    setOpen(false);
    executeEditColumn(values);
  };

  return (
    <Popover
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) {
          const formValues = form.getValues();
          if (formValues.name !== columnName) {
            executeEditColumn({ id: columnId, name: formValues.name });
          }
        }
      }}
      open={open}
    >
      <PopoverAnchor />
      <PopoverTrigger>
        <span className="flex items-center gap-1.5">
          <Icon className="size-4" /> {form.watch("name")}
        </span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[240px] p-0" side="bottom">
        <div className="flex flex-col">
          <Form {...form}>
            <form
              className="flex flex-1 flex-col px-3 py-2.5"
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
              </div>
              <button className="hidden" type="submit">
                Submit
              </button>
            </form>
          </Form>
          <div className="border-t p-1">
            <button
              className="hover:bg-accent hover:text-accent-foreground flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none transition-colors"
              disabled={status === "executing"}
              onClick={() => {
                execute({ id: columnId });
              }}
              type="button"
            >
              <Trash2Icon className="mr-2 size-4" /> Delete
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
