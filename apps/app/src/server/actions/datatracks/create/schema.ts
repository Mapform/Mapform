import { type z } from "zod";
import { DataTrackCreateArgsSchema } from "@mapform/db/prisma/zod";

export const createDataTrackSchema = DataTrackCreateArgsSchema;
export type CreateDataTrackSchema = z.infer<typeof createDataTrackSchema>;
