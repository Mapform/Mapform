import { Button } from "@mapform/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { SendIcon } from "lucide-react";
import { getForm } from "~/data/forms/get-form";
import { ShareContent } from "./share-content";

export default async function Actions({
  params,
}: {
  params: { formId: string };
}) {
  const form = await getForm({
    formId: params.formId,
  });

  if (!form) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button disabled={!form.isDirty} variant="ghost">
          <SendIcon className="h-4 w-4 mr-2" />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent collisionPadding={16}>
        <ShareContent
          formId={params.formId}
          isDirty={form.isDirty}
          numberOfVersions={form._count.formVersions}
        />
      </PopoverContent>
    </Popover>
  );
}
