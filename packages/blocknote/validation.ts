import { z } from "zod";

const styleTextSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
  styles: z.record(z.string(), z.string()),
});

const linkSchema = z.object({
  type: z.literal("link"),
  href: z.string(),
  content: styleTextSchema.array(),
});

const baseBlockSchema = z.object({
  id: z.string(),
  type: z.string(),
  props: z.record(z.string(), z.unknown()),
  content: z
    .union([styleTextSchema, linkSchema, z.unknown()])
    .array()
    .optional(),
});

type Block = z.infer<typeof baseBlockSchema> & {
  children: Block[];
};

export const blockSchema: z.ZodType<Block> = baseBlockSchema.extend({
  children: z.lazy(() => blockSchema.array()),
});
