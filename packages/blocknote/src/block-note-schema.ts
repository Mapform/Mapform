import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import type { BlockFromConfig, Block } from "@blocknote/core";
import { Pin } from "./custom-blocks/pin";
import { Image } from "./custom-blocks/image";
import { TextInput } from "./custom-blocks/text-input";

export const customBlockSpecs = {
  pin: Pin,
  image: Image,
  textInput: TextInput,
} as const;

const { paragraph, numberedListItem, bulletListItem, heading } =
  defaultBlockSpecs;

export const schema = BlockNoteSchema.create({
  blockSpecs: {
    paragraph,
    heading,
    numberedListItem,
    bulletListItem,

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

export type TextInputBlock = BlockFromConfig<
  typeof TextInput.config,
  typeof schema.inlineContentSchema,
  typeof schema.styleSchema
>;

export type PinBlock = BlockFromConfig<
  typeof Pin.config,
  typeof schema.inlineContentSchema,
  typeof schema.styleSchema
>;

export type ImageBlock = BlockFromConfig<
  typeof Image.config,
  typeof schema.inlineContentSchema,
  typeof schema.styleSchema
>;
