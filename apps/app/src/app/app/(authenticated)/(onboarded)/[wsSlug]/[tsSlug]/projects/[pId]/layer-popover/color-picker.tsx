import colors from "tailwindcss/colors";
import type { UpsertLayerSchema } from "@mapform/backend/data/layers/upsert-layer/schema";
import { cn } from "@mapform/lib/classnames";
import type { UseFormReturn } from "@mapform/ui/components/form";
import { FormField, FormLabel } from "@mapform/ui/components/form";
import { Slider } from "@mapform/ui/components/slider";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@mapform/ui/components/popover";
import { useState } from "react";
import { MoonIcon, SunMediumIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";

const selectedColors = (({
  gray,
  red,
  orange,
  amber,
  yellow,
  lime,
  green,
  emerald,
  teal,
  cyan,
  sky,
  blue,
  indigo,
  violet,
  purple,
  fuchsia,
  pink,
  rose,
}) => ({
  gray,
  red,
  orange,
  amber,
  yellow,
  lime,
  green,
  emerald,
  teal,
  cyan,
  sky,
  blue,
  indigo,
  violet,
  purple,
  fuchsia,
  pink,
  rose,
}))(colors);

const palette = Object.entries(selectedColors).reduce(
  (
    acc: Record<string, { value: string; name: string; hue: string }[]>,
    [name, hues],
  ) => {
    Object.entries(hues).forEach(([hue, color]) => {
      acc[hue] = [...(acc[hue] ?? []), { value: color, name, hue }];
    });

    return acc;
  },
  {},
);

const hueToSliderStep = {
  "50": 1,
  "100": 2,
  "200": 3,
  "300": 4,
  "400": 5,
  "500": 6,
  "600": 7,
  "700": 8,
  "800": 9,
  "900": 10,
  "950": 11,
} as const;

type Hue = keyof typeof hueToSliderStep;

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
  const activeColor = Object.values(palette)
    .flat()
    .find((color) => color.value === formColor);
  const [activeHue, setActiveHue] = useState<Hue>(
    (activeColor?.hue ?? "400") as Hue,
  );

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <Popover modal onOpenChange={setOpen} open={open}>
          <FormLabel htmlFor="color">{label}</FormLabel>
          <div className="flex justify-end flex-shrink-0 w-full">
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <div
                    className="flex h-[28px] w-full cursor-pointer items-center justify-center rounded-md border text-sm text-white shadow-sm"
                    style={{
                      backgroundColor: formColor,
                    }}
                  />
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent>{formColor}</TooltipContent>
            </Tooltip>
            <PopoverContent align="start" className="w-full" side="right">
              <div className="grid grid-cols-6 gap-2">
                {palette[activeHue]?.map((color) => (
                  <Tooltip key={color.value}>
                    <TooltipTrigger asChild>
                      <button
                        className={cn("size-6 rounded-full border", {
                          "ring-[3px] ring-blue-500 ring-offset-1":
                            formColor === color.value,
                        })}
                        onClick={() => {
                          form.setValue(name, color.value);
                        }}
                        style={{ backgroundColor: color.value }}
                        type="button"
                      />
                    </TooltipTrigger>
                    <TooltipContent className="capitalize">
                      {color.name} {color.hue}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
              <div className="flex items-center pt-4">
                <SunMediumIcon className="mr-2 size-5" />
                <Slider
                  max={hueToSliderStep[950]}
                  min={hueToSliderStep[50]}
                  onValueChange={(value) => {
                    const hue = Object.entries(hueToSliderStep).find(
                      ([_, step]) => step === value[0],
                    )![0] as Hue;
                    const color = palette[hue]?.find(
                      (c) => c.name === activeColor?.name,
                    )?.value;
                    color && form.setValue(name, color);
                    setActiveHue(hue);
                  }}
                  step={1}
                  value={[hueToSliderStep[activeHue]]}
                />
                <MoonIcon className="ml-2 size-5" />
              </div>
            </PopoverContent>
          </div>
        </Popover>
      )}
    />
  );
}
