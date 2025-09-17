import { useState, useCallback } from "react";
import { Input } from "@mapform/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { Trash2Icon } from "lucide-react";
import type { Column } from "@mapform/db/schema";
import { useAction, useOptimisticAction } from "next-safe-action/hooks";
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
  const [draftName, setDraftName] = useState(columnName);
  const { execute: executeDeleteColumn, isPending: isPendingDeleteColumn } =
    useAction(deleteColumnAction);
  const {
    execute: executeEditColumn,
    optimisticState,
    isPending: isPendingEditColumn,
  } = useOptimisticAction(updateColumnAction, {
    currentState: { name: columnName },
    updateFn: (state, input) => ({ name: input.name }),
  });

  const displayName = optimisticState.name;

  const commitIfChanged = useCallback(() => {
    if (!columnId) return;
    if (draftName !== columnName) {
      executeEditColumn({ id: columnId, name: draftName });
    }
  }, [columnId, columnName, draftName, executeEditColumn]);

  usePreventPageUnload(isPendingDeleteColumn || isPendingEditColumn);

  if (!columnId) {
    return (
      <span className="flex items-center gap-1.5">
        <Icon className="size-4 flex-shrink-0" />{" "}
        <span className="truncate">{columnName}</span>
      </span>
    );
  }

  return (
    <Popover
      modal
      onOpenChange={(val) => {
        setOpen(val);
        if (val) {
          setDraftName(displayName);
        } else {
          commitIfChanged();
        }
      }}
      open={open}
    >
      <PopoverTrigger className="hover:bg-muted w-full cursor-pointer rounded px-2 py-1 text-sm">
        <span className="flex items-center gap-1.5">
          <Icon className="size-4 flex-shrink-0" />{" "}
          <span className="truncate">{displayName}</span>
        </span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[240px] p-0" side="bottom">
        <div className="flex flex-col">
          <div className="flex flex-1 flex-col px-3 py-2.5">
            <Input
              autoComplete="off"
              onChange={(e) => setDraftName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  commitIfChanged();
                  setOpen(false);
                }
                if (e.key === "Escape") {
                  setDraftName(columnName);
                  setOpen(false);
                }
              }}
              placeholder={`${columnType.charAt(0).toUpperCase() + columnType.slice(1)} property`}
              s="sm"
              value={draftName}
              variant="filled"
            />
          </div>
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
                      if (columnId) executeDeleteColumn({ id: columnId });
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
