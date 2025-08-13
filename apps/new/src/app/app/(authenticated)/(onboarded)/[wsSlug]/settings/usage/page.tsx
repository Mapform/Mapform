import { notFound } from "next/navigation";
import { authClient } from "~/lib/safe-action";

async function fetchRowAndPageCount(workspaceSlug: string) {
  const response = await authClient.getRowCount({ workspaceSlug });
  const rowCount = response?.data;

  if (rowCount === undefined) {
    return notFound();
  }

  return rowCount;
}

async function fetchStorageUsage(workspaceSlug: string) {
  const response = await authClient.getStorageUsage({ workspaceSlug });
  const totalStorageBytes = response?.data?.totalStorageBytes;

  if (totalStorageBytes === undefined) {
    return notFound();
  }

  return totalStorageBytes;
}

export default async function UsagePage(props: {
  params: Promise<{ wsSlug: string }>;
}) {
  const params = await props.params;
  const [rowsUsed, storageUsed] = await Promise.all([
    fetchRowAndPageCount(params.wsSlug),
    fetchStorageUsage(params.wsSlug),
  ]);

  return <div>Usage</div>;
}
