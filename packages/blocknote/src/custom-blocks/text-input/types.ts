import type {
  InlineContentSchema,
  StyleSchema,
  BlockFromConfig,
} from "@blocknote/core";
import type { TextInput } from "./block";

export type TextInputBlock = BlockFromConfig<
  typeof TextInput.config,
  InlineContentSchema,
  StyleSchema
>;
