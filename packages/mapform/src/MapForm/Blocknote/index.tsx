"use client";

import { useState } from "react";
import "@blocknote/core/fonts/inter.css";
import type { Block } from "@blocknote/core";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import "./style.css";

interface BlocknoteProps {
  title?: string | null;
  description?: {
    content: Block[];
  };
  onTitleChange?: (content: string) => void;
  onDescriptionChange?: (content: { content: Block[] }) => void;
}

export function Blocknote({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: BlocknoteProps) {
  const [uncontrolledTitle, setUncontrolledTitle] = useState<string>(
    title || ""
  );
  const editor = useCreateBlockNote({
    initialContent: description?.content,
  });

  // Renders the editor instance using a React component.
  return (
    <div className="">
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
        editor={editor}
        onChange={() => {
          onDescriptionChange &&
            onDescriptionChange({
              content: editor.document,
            });
        }}
        sideMenu={false}
      />
    </div>
  );
}
