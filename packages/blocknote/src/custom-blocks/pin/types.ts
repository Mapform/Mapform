import type {
  InlineContentSchema,
  StyleSchema,
  BlockFromConfig,
} from "@blocknote/core";
import type { Pin } from "./block";

export type PinBlock = BlockFromConfig<
  typeof Pin.config,
  InlineContentSchema,
  StyleSchema
>;
