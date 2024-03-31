import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import { usePrevious } from "@mapform/lib/use-previous";

import "./placeholder.css";

interface TiptapProps {
  id: string;
  title?: string;
  description?: string;
  onTitleChange?: (content: string) => void;
  onDescriptionChange?: (content: string) => void;
}

export function Tiptap({
  id,
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: TiptapProps) {
  const prevId = usePrevious(id);
  const titleEditor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Untitled" }),
    ],
    content: title,
    enableInputRules: false,
    enablePasteRules: false,
    editable: Boolean(onTitleChange),
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert text-gray-800 font-semibold prose-xl mb-1 leading-normal focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onTitleChange?.(editor.getHTML());
    },
  });

  const descriptionEditor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Description" }),
    ],
    content: description,
    editable: Boolean(onDescriptionChange),
    // enableInputRules: false,
    // enablePasteRules: false,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert text-gray-800 mb-2 leading-normal focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onDescriptionChange?.(editor.getHTML());
    },
  });

  /**
   * Update TipTap
   */
  useEffect(() => {
    if (prevId === id) return;

    titleEditor?.commands.setContent(title || "<p></p>");
    descriptionEditor?.commands.setContent(description || "<p></p>");
  }, [id, titleEditor, title, descriptionEditor, description, prevId]);

  return (
    <>
      {/* Title */}
      <EditorContent editor={titleEditor} />
      {/* Description */}
      <EditorContent editor={descriptionEditor} />
    </>
  );
}
