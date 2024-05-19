"use server";

import { z } from "zod";
import slugify from "slugify";
import { workspaceModel } from "@mapform/db/models";

const workspaceSchema = z.object({
  name: z.string().min(3).max(24),
  orgSlug: z.string(),
});

export async function createWorkspace(orgSlug: string, formData: FormData) {
  const parsed = workspaceSchema.parse({
    name: formData.get("name"),
    orgSlug,
  });

  const slug = slugify(parsed.name, {
    lower: true,
    strict: true,
  });

  return workspaceModel.create({
    slug,
    name: parsed.name,
    organization: {
      connect: {
        slug: orgSlug,
      },
    },
  });
}
