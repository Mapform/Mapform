import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { ShortTextInput } from "./custom-blocks/short-text-input";

export const schema = BlockNoteSchema.create({
  blockSpecs: {
    // Adds all default blocks.
    ...defaultBlockSpecs,
    "short-text-input": ShortTextInput,
  },
});

export type CustomBlock = typeof schema.Block;