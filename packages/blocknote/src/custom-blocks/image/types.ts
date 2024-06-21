import type {
  InlineContentSchema,
  StyleSchema,
  BlockFromConfig,
} from "@blocknote/core";
import type { Image } from "./block";

export type ImageBlock = BlockFromConfig<
  typeof Image.config,
  InlineContentSchema,
  StyleSchema
>;
