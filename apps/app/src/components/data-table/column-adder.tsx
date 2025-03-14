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
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "@mapform/ui/components/command";
import {
  createColumnSchema,
  type CreateColumnSchema,
} from "@mapform/backend/data/columns/create-column/schema";
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { createColumnAction } from "~/data/columns/create-column";
import { cn } from "@mapform/lib/classnames";
import { useState } from "react";

interface ColumnAdderProps {
  datasetId: string;
}

export function ColumnAdder({ datasetId }: ColumnAdderProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { execute, isPending } = useAction(createColumnAction, {
    onSuccess: () => {
      console.log("success");
      setPopoverOpen(false);
      form.reset();
    },
  });
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
    <Popover modal open={popoverOpen} onOpenChange={setPopoverOpen}>
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
                  <Popover modal onOpenChange={setOpen} open={open}>
                    <FormLabel htmlFor="type">Type</FormLabel>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          className="ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-7 w-full items-center justify-between whitespace-nowrap rounded-md border-0 bg-stone-100 px-2 py-0.5 text-sm font-normal capitalize shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                          id="type"
                          size="icon-xs"
                          variant="ghost"
                        >
                          {form.watch("type")
                            ? columnTypeEnum.enumValues.find(
                                (type) => type === field.value,
                              )
                            : "Select type..."}
                          <ChevronsUpDownIcon className="size-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="w-[200px] p-0"
                      side="right"
                    >
                      <Command>
                        <CommandInput
                          className="h-9"
                          onValueChange={(v: string) => {
                            setQuery(v);
                          }}
                          placeholder="Search types..."
                          value={query}
                        />
                        <CommandList>
                          <CommandEmpty>No type found.</CommandEmpty>
                          <CommandGroup>
                            {columnTypeEnum.enumValues.map((type) => (
                              <CommandItem
                                className="capitalize"
                                value={type}
                                key={type}
                                onSelect={() => {
                                  form.setValue("type", type);
                                  // Used to trigger the validation
                                  void form.trigger("type");
                                  setQuery("");
                                  setOpen(false);
                                }}
                              >
                                {type}
                                <CheckIcon
                                  className={cn(
                                    "ml-auto size-4",
                                    field.value === type
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              />
              <Button
                className="col-span-2"
                disabled={isPending || !form.formState.isValid}
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
