import { useMeasure } from "@mapform/lib/hooks/use-measure";
import { Button } from "@mapform/ui/components/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@mapform/ui/components/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@mapform/ui/components/popover";
import { ChevronRightIcon, TriangleIcon } from "lucide-react";
import { useState } from "react";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export const SearchLocationMarker = ({ title }: { title: string }) => {
  const { ref, bounds } = useMeasure<HTMLDivElement>();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string>("");

  return (
    <div
      className="bg-white p-4 rounded-md shadow-md w-[240px] relative"
      style={{
        transform: `translateY(-${bounds.height / 2 + 16 + 8}px)`,
      }}
      ref={ref}
    >
      <div className="flex flex-col">
        <h1 className="text-base font-semibold">{title}</h1>
        <div className="mt-8 flex">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                className="ml-auto"
                role="combobox"
                size="sm"
                aria-expanded={open}
              >
                Add to
                <ChevronRightIcon className="ml-2 -mr-1 size-4 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              side="right"
              className="w-[200px] p-0"
            >
              <Command>
                <CommandInput
                  placeholder="Search layers..."
                  value={query}
                  onValueChange={(value: string) => setQuery(value)}
                />
                <CommandList>
                  <CommandEmpty
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 m-1"
                    onClick={() => {
                      setQuery("");
                      setOpen(false);
                    }}
                  >
                    <p>Create: </p>
                    <p className="block max-w-48 truncate font-semibold text-primary ml-1">
                      {query}
                    </p>
                  </CommandEmpty>
                  <CommandGroup>
                    {query.length ? (
                      <CommandItem
                        onClick={() => {
                          setQuery("");
                          setOpen(false);
                        }}
                      >
                        <p>Create: </p>
                        <p className="block max-w-48 truncate font-semibold text-primary ml-1">
                          {query}
                        </p>
                      </CommandItem>
                    ) : null}
                    {frameworks.map((framework) => (
                      <CommandItem
                        key={framework.value}
                        value={framework.value}
                        onSelect={() => {
                          setOpen(false);
                        }}
                      >
                        {framework.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Caret */}
      <TriangleIcon
        className="absolute text-white rotate-180 -translate-x-1/2 left-1/2 -bottom-4 size-5"
        fill="white"
      />
    </div>
  );
};
