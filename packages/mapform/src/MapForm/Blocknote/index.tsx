"use client";

import { useState } from "react";
import "@blocknote/core/fonts/inter.css";
import {
  BlockNoteSchema,
  defaultBlockSpecs,
  filterSuggestionItems,
  insertOrUpdateBlock,
  type Block,
} from "@blocknote/core";
import {
  BlockNoteView,
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote,
} from "@blocknote/react";
import "@blocknote/react/style.css";
import { TextIcon } from "lucide-react";
import { Button } from "@mapform/ui/components/button";
import { Form, useForm } from "@mapform/ui/components/form";
import { ShortTextInput } from "./custom-blocks/short-text-input";
import "./style.css";

const schema = BlockNoteSchema.create({
  blockSpecs: {
    // Adds all default blocks.
    ...defaultBlockSpecs,
    "short-text-input": ShortTextInput,
  },
});

type CustomBlock = typeof schema.Block;

interface BlocknoteProps {
  editable: boolean;
  title?: string | null;
  description?: {
    content: Block[];
  };
  onTitleChange?: (content: string) => void;
  onDescriptionChange?: (content: { content: CustomBlock[] }) => void;
}

export function Blocknote({
  title,
  editable,
  description,
  onTitleChange,
  onDescriptionChange,
}: BlocknoteProps) {
  const form = useForm({
    defaultValues: {
      "8d4cafab-a24b-483a-ade5-9c37734058c3": "test",
    },
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

  const insertAlert = (edtr: typeof schema.BlockNoteEditor) => ({
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

  const onSubmit = (data) => {
    console.log(data);
  };

  // Renders the editor instance using a React component.
  return (
    <Form {...form}>
      <form
        className="h-full flex flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* Title */}
        <input
          className="border-0 text-2xl font-bold w-full mb-2 p-0 outline-none border-transparent focus:border-transparent focus:ring-0 placeholder-gray-300"
          onChange={(e) => {
            setUncontrolledTitle(e.target.value);
            onTitleChange && onTitleChange(e.target.value);
          }}
          placeholder="Untitled"
          value={uncontrolledTitle}
        />

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
              // Gets all default slash menu items and `insertAlert` item.
              return filterSuggestionItems(
                [...getDefaultReactSlashMenuItems(editor), insertAlert(editor)],
                query
              );
            }}
            triggerCharacter="/"
          />
        </BlockNoteView>
        <div className="mt-auto">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
