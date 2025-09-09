import type { z } from "zod";
import { insertRowSchema } from "@mapform/db/schema";

export const createRowSchema = insertRowSchema.pick({
  projectId: true,
  name: true,
  description: true,
  icon: true,
  geometry: true,
  geoapifyPlaceId: true,
  osmId: true,
});

export type CreateRowSchema = z.infer<typeof createRowSchema>;
