import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@mapform/ui/components/popover";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAction } from "next-safe-action/hooks";
import { useCallback, useRef, useState } from "react";
import { usePreventPageUnload } from "@mapform/lib/hooks/use-prevent-page-unload";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  upsertCellSchema,
  type UpsertCellSchema,
} from "@mapform/backend/data/cells/upsert-cell/schema";
import { upsertCellAction } from "~/data/cells/upsert-cell";
import type { columnTypeEnum } from "@mapform/db/schema";
import { Switch } from "@mapform/ui/components/switch";
import StringInput from "./string-input";
import NumberInput from "./number-input";
import DateInput from "./date-input";

type PropertyValue = string | number | boolean | Date | null | undefined;

interface ValueEditorProps {
  value: PropertyValue;
  type: (typeof columnTypeEnum.enumValues)[number];
  rowId?: string;
  columnId?: string;
  emptyText?: string;
}

//

export function PropertyValueEditor({
  value,
  type,
  rowId,
  columnId,
  emptyText = "",
}: ValueEditorProps) {
  const cellEl = useRef<HTMLTableCellElement>(null);

  const [draft, setDraft] = useState<PropertyValue>(value);
  const { execute: executeUpsertCell, isPending } = useAction(upsertCellAction);
  const [open, setOpen] = useState(false);

  usePreventPageUnload(isPending);

  const saveIfChanged = useCallback(() => {
    const payload = { rowId, columnId, type, value: draft } as UpsertCellSchema;
    const res = upsertCellSchema.safeParse(payload);
    if (res.success && value !== draft) {
      executeUpsertCell(res.data);
    }
  }, [rowId, columnId, type, draft, value, executeUpsertCell]);

  const renderCellContent = useCallback((): React.ReactNode => {
    if (draft == null || draft === "") {
      return <span className="text-muted-foreground">{emptyText}</span>;
    }

    if (type === "date") {
      return format(new Date(draft as Date | string), "PP hh:mm b", {
        locale: enUS,
      });
    }

    return typeof draft === "string" || typeof draft === "number"
      ? draft
      : String(draft);
  }, [draft, emptyText, type]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open && e.key === "Enter") {
        setOpen(true);
      }
    },
    [open],
  );

  const handleEditorKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        cellEl.current?.focus();
      }
      if (e.key === "Enter" && open) {
        saveIfChanged();
        setOpen(false);
        cellEl.current?.focus();
      }
    },
    [open, saveIfChanged],
  );

  const handlePopoverOpenChange = useCallback(
    (val: boolean) => {
      setOpen(val);
      if (!val) {
        saveIfChanged();
      }
    },
    [saveIfChanged],
  );

  const commitValue = useCallback(
    (next: PropertyValue) => {
      setDraft(next);
      const payload = {
        rowId,
        columnId,
        type,
        value: next,
      } as UpsertCellSchema;
      const res = upsertCellSchema.safeParse(payload);
      if (res.success) {
        executeUpsertCell(res.data);
      }
    },
    [rowId, columnId, type, executeUpsertCell],
  );

  const renderPopoverField = useCallback(() => {
    switch (type) {
      case "string":
        return (
          <StringInput
            value={(draft as string | null | undefined) ?? null}
            onChange={setDraft}
          />
        );
      case "number":
        return (
          <NumberInput
            value={(draft as number | string | null | undefined) ?? null}
            onChange={(v) => setDraft(v)}
          />
        );
      case "date":
        return (
          <DateInput
            value={(draft as Date | null | undefined) ?? null}
            onChange={(v) => setDraft(v)}
          />
        );
      default:
        return null;
    }
  }, [draft, type]);

  // Render boolean input inline (no popover needed)
  if (type === "bool") {
    return (
      <div
        className="hover:bg-muted flex w-full cursor-pointer items-center rounded px-2 py-1"
        onClick={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest('[role="switch"]')) return;
          const nextChecked = !draft;
          commitValue(nextChecked);
        }}
      >
        <Switch
          checked={!!draft}
          onClick={(e) => e.stopPropagation()}
          onCheckedChange={(e) => commitValue(e)}
        />
      </div>
    );
  }

  return (
    <div
      onClick={() => setOpen(true)}
      onKeyDown={handleKeyDown}
      ref={cellEl}
      tabIndex={0}
      className="w-full"
    >
      <div onKeyDown={handleEditorKeyDown}>
        <Popover onOpenChange={handlePopoverOpenChange} open={open}>
          <div className="hover:bg-muted w-full cursor-pointer rounded px-2 py-1 text-sm">
            {renderCellContent()}
          </div>
          <PopoverAnchor />
          <PopoverContent
            align="start"
            className="w-full min-w-72 overflow-hidden p-0"
            side="top"
          >
            {renderPopoverField()}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
