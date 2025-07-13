import { Button } from "@mapform/ui/components/button";
import { useForm, zodResolver, Form } from "@mapform/ui/components/form";
import {
  createColumnSchema,
  type CreateColumnSchema,
} from "@mapform/backend/data/columns/create-column/schema";
import { PlusIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { createColumnAction } from "~/data/columns/create-column";
import { useState } from "react";
import { useProject } from "../../context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mapform/ui/components/dropdown-menu";
import { COLUMNS } from "~/constants/columns";

export function ColumnAdder() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { projectService } = useProject();
  const { execute, isPending } = useAction(createColumnAction, {
    onSuccess: () => {
      console.log("success");
      setPopoverOpen(false);
      form.reset();
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const form = useForm<CreateColumnSchema>({
    defaultValues: {
      projectId: projectService.optimisticState.id,
      name: "",
      type: "string",
    },
    resolver: zodResolver(createColumnSchema),
  });

  const onSubmit = (values: CreateColumnSchema) => {
    console.log("onSubmit", values);
    execute(values);
  };

  const handleColumnTypeSelect = (type: CreateColumnSchema["type"]) => {
    form.setValue("type", type);
    // Auto-generate a name based on the type
    const typeName = COLUMNS[type].name;
    form.setValue("name", typeName);
    void form.handleSubmit(onSubmit)();
  };

  return (
    <DropdownMenu modal open={popoverOpen} onOpenChange={setPopoverOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="icon-xs" variant="ghost">
          <PlusIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="right" className="w-56">
        <Form {...form}>
          <form
            className="flex flex-1 flex-col"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {Object.entries(COLUMNS).map(([type, { name, icon: Icon }]) => (
              <DropdownMenuItem
                className="hover:outline-none"
                key={type}
                onSelect={() => {
                  handleColumnTypeSelect(type as CreateColumnSchema["type"]);
                }}
              >
                <Icon className="size-4" />
                {name}
              </DropdownMenuItem>
            ))}
          </form>
        </Form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
