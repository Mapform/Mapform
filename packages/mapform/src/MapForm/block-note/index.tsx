"use client";

import type { z } from "zod";
import { useState } from "react";
import "@blocknote/core/fonts/inter.css";
import { filterSuggestionItems, insertOrUpdateBlock } from "@blocknote/core";
import {
  BlockNoteView,
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote,
} from "@blocknote/react";
import "@blocknote/react/style.css";
import { TextIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@mapform/ui/components/button";
import { Form, useForm, zodResolver } from "@mapform/ui/components/form";
import { type FormSchema } from "@mapform/lib/schemas/form-step-schema";
import { schema, type CustomBlock } from "../../lib/block-note-schema";
import { getZodSchemaFromBlockNote } from "../../lib/zod-schema-from-blocknote";
import { StepContext } from "./context";
import "./style.css";

interface BlocknoteProps {
  editable: boolean;
  title?: string | null;
  description?: {
    content: CustomBlock[];
  };
  defaultFormValues?: Record<string, string>;
  onNext?: () => void;
  onPrev?: () => void;
  onTitleChange?: (content: string) => void;
  onDescriptionChange?: (content: { content: CustomBlock[] }) => void;
  onStepSubmit?: (data: FormSchema) => void;
}

export function Blocknote({
  title,
  onPrev,
  onNext,
  editable,
  description,
  onTitleChange,
  onDescriptionChange,
  onStepSubmit,
  defaultFormValues,
}: BlocknoteProps) {
  const blocknoteStepSchema = getZodSchemaFromBlockNote(
    description?.content || []
  );
  const form = useForm<z.infer<typeof blocknoteStepSchema>>({
    resolver: zodResolver(blocknoteStepSchema),
    defaultValues: defaultFormValues,
  });
  const [uncontrolledTitle, setUncontrolledTitle] = useState<string>(
    title || ""
  );
  const editor = useCreateBlockNote({
    initialContent: description?.content,
    placeholders: {
      default: "Write a description, or press '/' for commands...",
    },
    schema,
  });

  const insertShortTextInput = (edtr: typeof schema.BlockNoteEditor) => ({
    title: "Short Text Input",
    onItemClick: () => {
      insertOrUpdateBlock(edtr, {
        type: "short-text-input",
      });
    },
    aliases: [
      "alert",
      "notification",
      "emphasize",
      "warning",
      "error",
      "info",
      "success",
    ],
    group: "Other",
    icon: <TextIcon />,
  });

  const onSubmit = (data: FormSchema) => {
    onStepSubmit && onStepSubmit(data);
  };

  // Renders the editor instance using a React component.
  return (
    <StepContext.Provider value={{ editable }}>
      <Form {...form}>
        <form
          className="h-full flex flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Content */}
          <div className="overflow-y-auto p-4 pb-0">
            {/* Title */}
            {editable ? (
              <input
                className="border-0 text-2xl font-bold w-full mb-2 p-0 outline-none border-transparent focus:border-transparent focus:ring-0 placeholder-gray-300"
                onChange={(e) => {
                  setUncontrolledTitle(e.target.value);
                  onTitleChange && onTitleChange(e.target.value);
                }}
                placeholder="Untitled"
                value={uncontrolledTitle}
              />
            ) : (
              <h1 className="border-0 text-2xl font-bold w-full mb-2 p-0">
                {title ?? "Untitled"}
              </h1>
            )}

            {/* Description */}
            <BlockNoteView
              className="flex-1"
              editable={editable}
              editor={editor}
              onChange={() => {
                onDescriptionChange &&
                  onDescriptionChange({
                    content: editor.document,
                  });
              }}
              sideMenu={false}
              slashMenu={false}
            >
              <SuggestionMenuController
                getItems={async (query) => {
                  return filterSuggestionItems(
                    [
                      ...getDefaultReactSlashMenuItems(editor),
                      insertShortTextInput(editor),
                    ],
                    query
                  );
                }}
                triggerCharacter="/"
              />
            </BlockNoteView>
          </div>
          <div className="mt-auto flex justify-between p-4">
            <div className="gap-2">
              <Button
                onClick={onPrev}
                size="icon"
                type="button"
                variant="ghost"
              >
                <ChevronLeftIcon />
              </Button>
              <Button
                onClick={onNext}
                size="icon"
                type="button"
                variant="ghost"
              >
                <ChevronRightIcon />
              </Button>
            </div>
            <Button onClick={onNext} type="submit">
              Next
            </Button>
          </div>
        </form>
      </Form>
    </StepContext.Provider>
  );
}
