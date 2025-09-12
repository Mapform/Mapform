import {
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
  defaultStyleSpecs,
} from "@blocknote/core";

export const schema = BlockNoteSchema.create({
  blockSpecs: {
    // enable the default blocks if desired
    ...defaultBlockSpecs,

    // Add your own custom blocks:
    // customBlock: CustomBlock,
  },
  // inlineContentSpecs: {
  //   // enable the default inline content if desired
  ...defaultInlineContentSpecs,

  //   // Add your own custom inline content:
  //   // customInlineContent: CustomInlineContent,
  // },
  // styleSpecs: {
  //   // enable the default styles if desired
  ...defaultStyleSpecs,

  //   // Add your own custom styles:
  //   // customStyle: CustomStyle
  // },
});

export type CustomBlock = typeof schema.Block;
export type CustomPartialBlock = typeof schema.PartialBlock;
export type CustomBlockNoteEditor = typeof schema.BlockNoteEditor;
