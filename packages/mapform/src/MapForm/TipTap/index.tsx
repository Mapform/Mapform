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
    extensions: [StarterKit, Placeholder.configure({ placeholder: "Title" })],
    content: title,
    editable: Boolean(onTitleChange),
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
    onUpdate: ({ editor }) => {
      onDescriptionChange?.(editor.getHTML());
    },
  });

  /**
   * Update TipTap
   */
  useEffect(() => {
    if (prevId === id) return;

    if (title) {
      titleEditor?.commands.setContent(title);
    }

    if (description) {
      descriptionEditor?.commands.setContent(description);
    }
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
