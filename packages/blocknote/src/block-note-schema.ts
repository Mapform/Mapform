"use client";

import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import type { Block } from "@blocknote/core";
import { Pin } from "./custom-blocks/pin/block";
import { Image } from "./custom-blocks/image/block";
import { TextInput } from "./custom-blocks/text-input/block";

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

export * from "./custom-blocks/text-input";
export * from "./custom-blocks/pin";
export * from "./custom-blocks/image";
