import { Label } from "@mapform/ui/components/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";

interface UsageProps {
  rowLimit: number;
  rowsUsed: number;
  storageLimit: number;
  storageUsed: number;
}

export function Usage({
  rowLimit,
  rowsUsed,
  storageLimit,
  storageUsed,
}: UsageProps) {
  const rowUsagePercentage = (rowsUsed / rowLimit) * 100;
  const storageUsagePercentage = (storageUsed / storageLimit) * 100;

  const formatStorage = (bytes: number) => {
    const mb = bytes / (1000 * 1000);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col py-12">
      <div className="@4xl:grid-cols-3 grid grid-cols-1 gap-x-8">
        <div className="pb-8">
          <h2 className="text-md font-semibold">Usage</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Your Mapform data allowances.
          </p>
        </div>
        <div className="@4xl:col-span-2 grid-cols-1 space-y-6">
          <div className="inline-flex w-full flex-col gap-3">
            <Label>Rows Used</Label>
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
                    {rowsUsed} / {rowLimit} Rows •{" "}
                    {Math.round(rowUsagePercentage)}% used
                  </span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="text-muted-foreground text-sm">
              The numbers of rows used in your workspace across projects and
              datasets.
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
                    {formatStorage(storageUsed)} / {formatStorage(storageLimit)}{" "}
                    • {Math.round(storageUsagePercentage)}% used
                  </span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="text-muted-foreground text-sm">
              The amount of storage used for images in your workspace.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
