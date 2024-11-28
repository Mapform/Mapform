import type { UpsertLayerSchema } from "@mapform/backend/layers/upsert-layer/schema";
import { cn } from "@mapform/lib/classnames";
import type { UseFormReturn } from "@mapform/ui/components/form";
import { FormField, FormLabel } from "@mapform/ui/components/form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@mapform/ui/components/popover";
import { useState } from "react";

const colorOptions = [
  { value: "#3b82f6", label: "Blue" },
  { value: "#0ea5e9", label: "Sky" },
  { value: "#6366f1", label: "Indigo" },
  { value: "#22c55e", label: "Green" },
  { value: "#14b8a6", label: "Teal" },
  { value: "#ef4444", label: "Red" },
  { value: "#ec4899", label: "Pink" },
  { value: "#f43f5e", label: "Rose" },
  { value: "#f97316", label: "Orange" },
  { value: "#f59e0b", label: "Amber" },
  { value: "#a855f7", label: "Purple" },
  { value: "#78716c", label: "Stone" },
];

export function ColorPicker({
  name,
  form,
  label,
}: {
  name: "markerProperties.color" | "pointProperties.color";
  form: UseFormReturn<UpsertLayerSchema>;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const formColor = form.watch(name) ?? "#3b82f6";

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <Popover modal onOpenChange={setOpen} open={open}>
          <FormLabel htmlFor="color">{label}</FormLabel>
          <div className="flex w-full flex-shrink-0 justify-end">
            <PopoverTrigger asChild>
              <div
                className="flex h-[28px] w-full cursor-pointer items-center justify-center rounded-md text-sm text-white shadow-sm"
                style={{
                  backgroundColor: formColor,
                }}
              >
                {formColor}
              </div>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="flex w-[200px] flex-wrap justify-evenly gap-2"
              side="right"
            >
              {colorOptions.map((color) => (
                <button
                  className={cn("size-8 rounded-full", {
                    "border-[3px] border-white border-opacity-70":
                      formColor === color.value,
                  })}
                  key={color.value}
                  onClick={() => {
                    form.setValue(name, color.value);
                    setOpen(false);
                  }}
                  style={{ backgroundColor: color.value }}
                  type="button"
                />
              ))}
            </PopoverContent>
          </div>
        </Popover>
      )}
    />
  );
}
