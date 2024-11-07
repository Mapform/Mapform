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
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { Trash2Icon } from "lucide-react";
import type { Column } from "@mapform/db/schema";
import { useAction } from "next-safe-action/hooks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@mapform/ui/components/alert-dialog";
import {
  editColumnSchema,
  type EditColumnSchema,
} from "@mapform/backend/columns/edit-column/schema";
import { editColumnAction } from "~/data/columns/edit-column";
import { deleteColumnAction } from "~/data/columns/delete-column";
import { COLUMN_ICONS } from "~/constants/column-icons";

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
  const { execute, status } = useAction(deleteColumnAction);
  const { execute: executeEditColumn } = useAction(editColumnAction);
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
      modal
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
              {/* So that hitting enter submits the form */}
              <button className="hidden" type="submit">
                Submit
              </button>
            </form>
          </Form>
          <div className="border-t p-1">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="hover:bg-accent hover:text-accent-foreground flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none transition-colors"
                  disabled={status === "executing"}
                  type="button"
                >
                  <Trash2Icon className="mr-2 size-4" /> Delete
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    All data in this column will be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={status === "executing"}
                    onClick={() => {
                      execute({ id: columnId });
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
