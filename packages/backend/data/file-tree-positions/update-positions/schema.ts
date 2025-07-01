import { z } from "zod";

export const updateFileTreePositionsSchema = z.object({
  teamspaceId: z.string().uuid(),
  parentId: z.string().uuid().nullable(),
  items: z.array(
    z.object({
      id: z.string().uuid(),
      itemType: z.enum(["folder", "project"]),
      position: z.number().int().min(0),
    }),
  ),
});
