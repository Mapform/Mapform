import "@blocknote/core";
import type { schema } from "@mapform/blocknote";

export declare module "@blocknote/core" {
  // Override the default schema types
  type DefaultStyleSchema = typeof schema.styleSchema;
  type DefaultBlockSchema = typeof schema.blockSchema;
  type DefaultInlineContentSchema = typeof schema.inlineContentSchema;
}
