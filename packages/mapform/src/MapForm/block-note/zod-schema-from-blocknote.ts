import { z } from "zod";
import { type CustomBlock } from "./block-note-schema";

interface BlockNoteSchema {
  content: CustomBlock[];
}

export function getZodSchemaFromBlockNote(blocks: CustomBlock[]) {}
