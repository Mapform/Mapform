import { Button } from "@mapform/ui/components/button";
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
import { ArrowLeftIcon } from "lucide-react";

interface NewLayerSidebarProps {
  setShowNewLayerSidebar: (show: boolean) => void;
}

export function NewLayerSidebar({
  setShowNewLayerSidebar,
}: NewLayerSidebarProps) {
  const form = useForm<CreateOrgSchema>({
    defaultValues: {
      name: "",
    },
    mode: "onChange",
    resolver: zodResolver(createOrgSchema),
  });

  return (
    <div className="absolute inset-0 bg-white z-10">
      <div className="p-4 border-b">
        <Button
          onClick={() => {
            setShowNewLayerSidebar(false);
          }}
          size="sm"
          variant="secondary"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" /> Close
        </Button>
      </div>
      <div className="p-4 border-b"></div>
    </div>
  );
}
