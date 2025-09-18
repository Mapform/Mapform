import { Label } from "@mapform/ui/components/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { notFound } from "next/navigation";
import { getWorkspaceDirectory } from "~/data/workspaces/get-workspace-directory";
import { authDataService } from "~/lib/safe-action";

async function fetchWorkspacePlan(workspaceSlug: string) {
  const response = await getWorkspaceDirectory({ slug: workspaceSlug });
  const workspacePlan = response?.data?.plan;

  if (!workspacePlan) {
    return notFound();
  }

  return workspacePlan;
}

async function fetchRowAndPageCount(workspaceSlug: string) {
  const response = await authDataService.getRowCount({ workspaceSlug });
  const rowCount = response?.data;

  if (rowCount === undefined) {
    return notFound();
  }

  return rowCount;
}

async function fetchStorageUsage(workspaceSlug: string) {
  const response = await authDataService.getStorageUsage({ workspaceSlug });
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
  const [rowsUsed, storageUsed, workspacePlan] = await Promise.all([
    fetchRowAndPageCount(params.wsSlug),
    fetchStorageUsage(params.wsSlug),
    fetchWorkspacePlan(params.wsSlug),
  ]);

  const rowLimit = workspacePlan.rowLimit;
  const storageLimit = workspacePlan.storageLimit;

  const rowUsagePercentage = (rowsUsed / rowLimit) * 100;
  const storageUsagePercentage = (storageUsed / storageLimit) * 100;

  const formatStorage = (bytes: number) => {
    const mb = bytes / (1000 * 1000);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col space-y-8">
      <div className="inline-flex w-full flex-col gap-3">
        <Label>Features Used</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="w-full">
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="bg-primary h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, rowUsagePercentage)}%` }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <span>
                {rowsUsed} / {rowLimit} Rows • {Math.round(rowUsagePercentage)}%
                used
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="text-muted-foreground text-sm">
          The number of lines, shapes, and places you have added to your maps.
        </div>
      </div>

      <div className="inline-flex w-full flex-col gap-3">
        <Label>Storage Used</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="w-full">
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="bg-primary h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, storageUsagePercentage)}%`,
                  }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <span>
                {formatStorage(storageUsed)} / {formatStorage(storageLimit)} •{" "}
                {Math.round(storageUsagePercentage)}% used
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="text-muted-foreground text-sm">
          The amount of storage used for images in your workspace.
        </div>
      </div>
    </div>
  );
}
