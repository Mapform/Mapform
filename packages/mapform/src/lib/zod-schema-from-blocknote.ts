/**
 * This is for generate a zod schema for use with the user Form. TODO: This
 * should be refactored. The logic is spread across too many files. Should be
 * much easier to drop in new blocks.
 */
import { z } from "zod";
import { type CustomBlock } from "./block-note-schema";

// TODO: Figure out appropriate types for props
const schemaMap = {
  pin: (props: any) =>
    z.object({
      latitude: z.number(),
      longitude: z.number(),
    }),
  "text-input": (props: any) => {
    return props.required
      ? z.string()
      : z.string().optional().or(z.literal(""));
  },
};

/**
 * Scehmas for custom input blocks
 */
type CustomBlockTypes = "text-input" | "pin";
const customBlocks = ["text-input", "pin"] as CustomBlockTypes[];

export function getZodSchemaFromBlockNote(blocks: CustomBlock[]) {
  const filteredBlocks = blocks.filter((block) =>
    customBlocks.includes(block.type as CustomBlockTypes)
  );

  const zodObj = filteredBlocks.reduce(
    (acc, cur) => ({
      ...acc,
      [cur.id]: schemaMap[cur.type as CustomBlockTypes](cur.props),
    }),
    {}
  );

  return z.object(zodObj);
}
