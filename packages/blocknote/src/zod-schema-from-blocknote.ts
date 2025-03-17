import { z } from "zod";
import type {
  DocumentContent,
  PinBlock,
  TextInputBlock,
} from "./block-note-schema";

const schemaMap = {
  pin: (props: PinBlock["props"]) =>
    props.required
      ? z.object({
          y: z.number(),
          x: z.number(),
        })
      : z.object({
          y: z.number().optional(),
          x: z.number().optional(),
        }),
  textInput: (props: TextInputBlock["props"]) => {
    return props.required
      ? z.string().min(1)
      : z.string().optional().or(z.literal(""));
  },
};

/**
 * This is used to generate a Zod schema from a list of custom blocks inputs.
 */
export type InputCustomBlockTypes = PinBlock["type"] | TextInputBlock["type"];
const customBlocks = ["textInput", "pin"] as InputCustomBlockTypes[];

export function getFormSchemaFromBlockNote(blocks: DocumentContent) {
  const filteredBlocks = blocks.filter((block) =>
    customBlocks.includes(block.type as InputCustomBlockTypes),
  );

  const zodObj: Record<string, any> = filteredBlocks.reduce(
    (acc, cur) => ({
      ...acc,
      // @ts-expect-error -- Complex TS type needed. Ignoring for now.
      [cur.id]: schemaMap[cur.type as InputCustomBlockTypes](cur.props),
    }),
    {},
  );

  return z.object(zodObj);
}
