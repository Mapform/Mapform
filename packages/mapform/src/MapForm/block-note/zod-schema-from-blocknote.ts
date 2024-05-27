import { z } from "zod";
import { type CustomBlock, customBlockSpecs } from "./block-note-schema";

const schemaMap = {
  "short-text-input": (props: any) => {
    console.log(99999, props.required);
    return props.required
      ? z.string()
      : z.string().optional().or(z.literal(""));
  },
};

export function getZodSchemaFromBlockNote(blocks: CustomBlock[]) {
  const customBlockTypes = Object.keys(
    customBlockSpecs
  ) as (keyof typeof customBlockSpecs)[];
  const filteredBlocks = blocks.filter((block) =>
    customBlockTypes.includes(block.type as keyof typeof customBlockSpecs)
  );

  console.log(11111, filteredBlocks);

  const zodObj = filteredBlocks.reduce(
    (acc, cur) => ({
      ...acc,
      [cur.id]: schemaMap[cur.type as keyof typeof customBlockSpecs](cur.props),
    }),
    {}
  );

  return z.object(zodObj);
}
