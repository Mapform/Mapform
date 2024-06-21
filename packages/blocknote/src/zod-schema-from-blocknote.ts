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
          latitude: z.number(),
          longitude: z.number(),
        })
      : z.object({
          latitude: z.number().optional(),
          longitude: z.number().optional(),
        }),
  textInput: (props: TextInputBlock["props"]) => {
    return props.required
      ? z.string()
      : z.string().optional().or(z.literal(""));
  },
};

/**
 * This is used to generate a Zod schema from a list of custom blocks inputs.
 */
type InputCustomBlockTypes = PinBlock["type"] | TextInputBlock["type"];
const customBlocks = ["textInput", "pin"] as InputCustomBlockTypes[];

export function getFormSchemaFromBlockNote(blocks: DocumentContent) {
  const filteredBlocks = blocks.filter((block) =>
    customBlocks.includes(block.type as InputCustomBlockTypes)
  );

  const zodObj = filteredBlocks.reduce(
    (acc, cur) => ({
      ...acc,
      // @ts-expect-error -- Complex TS type needed. Ignoring for now.
      [cur.id]: schemaMap[cur.type as InputCustomBlockTypes](cur.props),
    }),
    {}
  );

  return z.object(zodObj);
}
