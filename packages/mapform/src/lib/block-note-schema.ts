import {
  BlockNoteSchema,
  defaultBlockSpecs,
  type Block,
} from "@blocknote/core";
import { ShortTextInput } from "./custom-blocks/short-text-input";

export const customBlockSpecs = {
  "short-text-input": ShortTextInput,
} as const;

export const schema = BlockNoteSchema.create({
  blockSpecs: {
    // Adds all default blocks.
    ...defaultBlockSpecs,
    // Adds custom blocks.
    ...customBlockSpecs,
  },
});

export type CustomBlock = Block<
  typeof schema.blockSchema,
  typeof schema.inlineContentSchema,
  typeof schema.styleSchema
>;
export type DocumentContent = CustomBlock[];
