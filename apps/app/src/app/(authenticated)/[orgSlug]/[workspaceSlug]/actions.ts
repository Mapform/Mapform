"use server";

import { z } from "zod";
import slugify from "slugify";
import { formModel, workspaceModel } from "@mapform/db/models";

export const getWorkspaceWithOrg = (slug: string, organizationSlug: string) =>
  workspaceModel.findOne(
    {
      slug,
      organizationSlug,
    },
    {
      organization: true,
    }
  );

export type WorkspaceWithOrg = NonNullable<
  Awaited<ReturnType<typeof getWorkspaceWithOrg>>
>;

const formSchema = z.object({
  name: z.string().min(3).max(24),
});

export async function createForm(
  workspaceSlug: string,
  orgSlug: string,
  formData: FormData
) {
  const parsed = formSchema.parse({
    name: formData.get("name"),
    workspaceSlug,
  });

  const slug = slugify(parsed.name, {
    lower: true,
    strict: true,
  });

  return formModel.create({
    slug,
    name: parsed.name,
    workspaceSlug,
    organizationSlug: orgSlug,
  });
}
