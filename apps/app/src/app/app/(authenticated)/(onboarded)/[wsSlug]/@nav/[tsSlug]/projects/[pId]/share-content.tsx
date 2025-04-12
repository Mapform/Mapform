"use client";

import { Clipboard } from "@mapform/ui/components/clipboard";
import type { GetProjectWithPages } from "@mapform/backend/data/projects/get-project-with-pages";
import { env } from "~/env.mjs";
import {
  Command,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@mapform/ui/components/command";
import {
  Form,
  zodResolver,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
} from "@mapform/ui/components/form";
import { useForm } from "@mapform/ui/components/form";
import {
  type UpdateProjectSchema,
  updateProjectSchema,
} from "@mapform/backend/data/projects/update-project/schema";
import { updateProjectAction } from "~/data/projects/update-project";
import { useAction } from "next-safe-action/hooks";
import { Button } from "@mapform/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { CheckIcon, ChevronsUpDownIcon, GlobeIcon } from "lucide-react";
import { cn } from "@mapform/lib/classnames";
import { useState } from "react";
import { useParams } from "next/navigation";

const visibilityOptions = [
  { value: "public", label: "Public" },
  { value: "closed", label: "Closed" },
];

export function ShareContent({
  project,
}: {
  project: NonNullable<GetProjectWithPages["data"]>;
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<UpdateProjectSchema>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      visibility: project.visibility,
    },
  });

  const { execute: updateProject, isPending } = useAction(updateProjectAction);
  const { wsSlug } = useParams();

  const onVisibilityChange = (value: "public" | "closed") => {
    form.setValue("visibility", value);
    updateProject({
      id: project.id,
      visibility: value,
    });
    setOpen(false);
  };

  const getShareUrl = () => {
    // Don't bother using subdomains in preview since its not supported
    if (env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
      return `${env.NEXT_PUBLIC_BASE_URL}/share/${wsSlug as string}/${project.id}`;
    }

    // Remove protocol (http, https) and www from base url
    const baseUrl = env.NEXT_PUBLIC_BASE_URL.replace(
      /^https?:\/\/(www\.)?/,
      "",
    );

    // Remove subdomains (if any)
    const baseUrlWithoutSubdomains = baseUrl.replace(/\.[^.]+$/, "");

    // Add wsSlug subdomain to base url
    return `${wsSlug as string}.${baseUrlWithoutSubdomains}/share/${project.id}`;
  };

  return (
    <div className="flex flex-col space-y-3">
      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem className="flex items-center justify-center gap-x-6">
                <FormLabel
                  className="flex items-center gap-1.5 text-nowrap"
                  htmlFor="visibility"
                >
                  <GlobeIcon className="size-4" /> Project visibility
                </FormLabel>
                <FormControl>
                  <Popover modal onOpenChange={setOpen} open={open}>
                    <PopoverTrigger asChild>
                      <Button
                        className="ring-offset-background placeholder:text-muted-foreground focus:ring-ring !mt-0 flex h-7 w-full items-center justify-between rounded-md border-0 bg-stone-100 px-2 py-0.5 text-sm font-normal shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
                        id="visibility"
                        variant="ghost"
                        disabled={isPending}
                      >
                        <span className="flex-1 truncate text-left capitalize">
                          {field.value}
                        </span>
                        <ChevronsUpDownIcon className="size-4 flex-shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-[200px] p-0">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {visibilityOptions.map((option) => (
                              <CommandItem
                                key={option.value}
                                onSelect={() =>
                                  onVisibilityChange(
                                    option.value as "public" | "closed",
                                  )
                                }
                                value={option.value}
                              >
                                <span className="flex-1 truncate text-left capitalize">
                                  {option.label}
                                </span>
                                <CheckIcon
                                  className={cn(
                                    "ml-auto size-4",
                                    field.value === option.value
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
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className="flex overflow-hidden rounded-md border shadow">
        <input
          className="w-full appearance-none border-none bg-gray-100 pl-2 pr-0 text-sm text-gray-500"
          value={getShareUrl()}
          readOnly
        />
        <Clipboard
          className="h-[36px] rounded-l-none border-l bg-white hover:bg-gray-50"
          clipboardText={getShareUrl()}
          copiedText="Copy"
          copyText="Copy"
          size="sm"
          variant="secondary"
        />
      </div>
    </div>
  );
}
