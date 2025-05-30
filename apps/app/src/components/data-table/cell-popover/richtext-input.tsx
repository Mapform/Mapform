import { FormField, FormItem, FormControl } from "@mapform/ui/components/form";
import {
  CustomBlockProvider,
  BlocknoteEditor,
  useCreateBlockNote,
  schema,
} from "@mapform/blocknote";
import { compressImage } from "~/lib/compress-image";
import { uploadImageAction } from "~/data/images";
import { toast } from "@mapform/ui/components/toaster";
import type { UseFormReturn } from "@mapform/ui/components/form";
import type { UpsertCellSchema } from "@mapform/backend/data/cells/upsert-cell/schema";
import { useAction } from "next-safe-action/hooks";

function RichtextInput({
  form,
}: {
  form: UseFormReturn<Extract<UpsertCellSchema, { type: "richtext" }>>;
}) {
  const editor = useCreateBlockNote({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Block types still need work
    initialContent: form.getValues().value?.content as any,
    placeholders: {
      default: "Write, or press '/' for commands...",
    },
    animations: false,
    schema,
  });
  const uploadImageServer = useAction(uploadImageAction, {
    onError: (response) => {
      if (
        response.error.validationErrors &&
        "image" in response.error.validationErrors
      ) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: response.error.validationErrors.image?._errors?.[0],
        });

        return;
      }

      toast({
        title: "Uh oh! Something went wrong.",
        description: "An error occurred while uploading the image.",
      });
    },
  });

  return (
    <CustomBlockProvider
      isEditing
      imageBlock={{
        onImageUpload: async (file: File) => {
          const compressedFile = await compressImage(
            file,
            0.9,
            2000,
            2000,
            1000,
          );
          const formData = new FormData();
          formData.append("image", compressedFile);

          const response = await uploadImageServer.executeAsync(formData);

          if (response?.serverError) {
            return null;
          }

          return response?.data?.url || null;
        },
      }}
    >
      <div className="box-content h-[360px] w-[360px] overflow-y-auto p-4 pl-16">
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <BlocknoteEditor
                  editor={editor}
                  includeFormBlocks={false}
                  onChange={() => {
                    field.onChange({ content: editor.document });
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </CustomBlockProvider>
  );
}

export default RichtextInput;
