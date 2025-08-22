import { useState } from "react";
import {
  useForm,
  zodResolver,
  Form,
  FormControl,
  FormField,
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
import { usePreventPageUnload } from "@mapform/lib/hooks/use-prevent-page-unload";
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
  updateColumnSchema,
  type UpdateColumnSchema,
} from "@mapform/backend/data/columns/update-column/schema";
import { updateColumnAction } from "~/data/columns/update-column";
import { deleteColumnAction } from "~/data/columns/delete-column";
import { COLUMNS } from "~/constants/columns";

interface PropertyColumnEditorProps {
  columnId?: string;
  columnName: string;
  columnType: Column["type"];
}

export function PropertyColumnEditor({
  columnId,
  columnName,
  columnType,
}: PropertyColumnEditorProps) {
  const Icon = COLUMNS[columnType].icon;
  const [open, setOpen] = useState(false);
  const { execute: executeDeleteColumn, isPending: isPendingDeleteColumn } =
    useAction(deleteColumnAction);
  const { execute: executeEditColumn, isPending: isPendingEditColumn } =
    useAction(updateColumnAction);
  const form = useForm<UpdateColumnSchema>({
    defaultValues: {
      id: columnId,
      name: columnName,
    },
    resolver: zodResolver(updateColumnSchema),
  });

  const onSubmit = (values: UpdateColumnSchema) => {
    setOpen(false);
    executeEditColumn(values);
  };

  usePreventPageUnload(isPendingDeleteColumn || isPendingEditColumn);

  if (!columnId) {
    return (
      <span className="flex items-center gap-1.5">
        <Icon className="size-4" />{" "}
        <span className="truncate">{columnName}</span>
      </span>
    );
  }

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
      <PopoverTrigger className="w-full">
        <span className="flex items-center gap-1.5">
          <Icon className="size-4" />{" "}
          <span className="truncate">{form.watch("name")}</span>
        </span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[240px] p-0" side="bottom">
        <div className="flex flex-col">
          <Form {...form}>
            <form
              className="flex flex-1 flex-col px-3 py-2.5"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <>
                    <div className="flex-1">
                      <FormControl>
                        <Input
                          disabled={field.disabled}
                          name={field.name}
                          onChange={field.onChange}
                          placeholder={`${columnType.charAt(0).toUpperCase() + columnType.slice(1)} property`}
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
                  disabled={isPendingDeleteColumn}
                  type="button"
                >
                  <Trash2Icon className="mr-2 size-4" /> Delete property
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
                    disabled={isPendingDeleteColumn}
                    onClick={() => {
                      executeDeleteColumn({ id: columnId });
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
