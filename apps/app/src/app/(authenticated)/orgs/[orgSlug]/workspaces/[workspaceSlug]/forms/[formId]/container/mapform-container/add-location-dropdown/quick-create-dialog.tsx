import { Button } from "@mapform/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@mapform/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
  zodResolver,
} from "@mapform/ui/components/form";
import { useAction } from "next-safe-action/hooks";
import {
  quickCreateDataLayerSchema,
  type QuickCreateDataLayerSchema,
} from "~/data/datalayer/quick-create/schema";

export const QuickCreateDialog = Dialog;
export const QuickCreateDialogTrigger = DialogTrigger;

interface QuickCreateContentProps {
  stepId: string;
  formId: string;
}

export function QuickCreateContent({
  stepId,
  formId,
}: QuickCreateContentProps) {
  const form = useForm<QuickCreateDataLayerSchema>({
    defaultValues: {
      name: "",
      stepId,
      formId,
    },
    resolver: zodResolver(quickCreateDataLayerSchema),
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Quick create</DialogTitle>
        <DialogDescription>
          Create a new dataset and layer with basic presets
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button>Create</Button>
      </DialogFooter>
    </DialogContent>
  );
}
