import { z } from "zod";
import { type CustomBlock } from "./block-note-schema";

const schemaMap = {
  // TODO: Figure out appropriate types for props
  "text-input": (props: any) => {
    return props.required
      ? z.string()
      : z.string().optional().or(z.literal(""));
  },
};

type CustomBlockTypes = "text-input";
const customBlocks = ["text-input"] as CustomBlockTypes[];

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
