import type { LiteralZodEventSchema } from "inngest";
import { z } from "zod";

export const mapAssistantEvent = z.object({
  name: z.literal("app/map.assistant"),
  data: z.object({
    message: z.string(),
  }),
}) satisfies LiteralZodEventSchema;
