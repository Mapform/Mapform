"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "~/lib/safe-action";

export const createEmptyDatasetAction = async (
  params: Last<Parameters<typeof authClient.createEmptyDataset>>,
) => {
  const headersList = await headers();
  const workspaceSlug = headersList.get("x-workspace-slug") ?? "";
  const teamspaceSlug = headersList.get("x-teamspace-slug") ?? "";
  const result = await authClient.createEmptyDataset(params);

  revalidatePath("/app/[wsSlug]/[tsSlug]/datasets", "page");
  revalidatePath("/app/[wsSlug]/[tsSlug]/projects/[pId]/project", "page");

  redirect(
    `/app/${workspaceSlug}/${teamspaceSlug}/datasets/${result?.data?.dataset?.id}`,
  );

  return result;
};
