import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { ShortTextInput } from "./custom-blocks/short-text-input";

export const customBlockSpecs = {
  "short-text-input": ShortTextInput,
} as const;

export const schema = BlockNoteSchema.create({
  blockSpecs: {
    // Adds all default blocks.
    ...defaultBlockSpecs,
    ...customBlockSpecs,
  },
});

export type CustomBlock = typeof schema.Block;
