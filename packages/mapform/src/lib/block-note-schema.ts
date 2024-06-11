import {
  BlockNoteSchema,
  defaultBlockSpecs,
  type Block,
} from "@blocknote/core";
import { Image } from "./custom-blocks/image";
import { ShortTextInput } from "./custom-blocks/text-input";

export const customBlockSpecs = {
  image: Image,
  "text-input": ShortTextInput,
} as const;

const { table: _, image: _2, ...rest } = defaultBlockSpecs;

export const schema = BlockNoteSchema.create({
  blockSpecs: {
    // Adds all default blocks.
    ...rest,
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
