import { z } from "zod";

export const coverPhotoSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid().optional(),
  rowId: z.string().uuid().optional(),
  blobId: z.string().uuid(),
  title: z.string().max(256).optional(),
  author: z.string().max(256).optional(),
  source: z.string().max(512).optional(),
  license: z.string().max(256).optional(),
  position: z.number().int().min(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createCoverPhotoSchema = z
  .object({
    projectId: z.string().uuid().optional(),
    rowId: z.string().uuid().optional(),
    blobId: z.string().uuid(),
    title: z.string().max(256).optional(),
    author: z.string().max(256).optional(),
    source: z.string().max(512).optional(),
    license: z.string().max(256).optional(),
    position: z.number().int().min(0),
  })
  .refine((data) => data.projectId || data.rowId, {
    message: "Either projectId or rowId must be provided",
    path: ["projectId", "rowId"],
  });

export const updateCoverPhotoSchema = z.object({
  title: z.string().max(256).optional(),
  author: z.string().max(256).optional(),
  source: z.string().max(512).optional(),
  license: z.string().max(256).optional(),
  position: z.number().int().min(0).optional(),
});
