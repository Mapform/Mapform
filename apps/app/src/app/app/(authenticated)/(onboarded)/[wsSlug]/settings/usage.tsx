import { cn } from "@mapform/lib/classnames";
import { Label } from "@mapform/ui/components/label";

const BLOCKS = 100;

interface UsageProps {
  rowLimit: number;
  rowsUsed: number;
}

export function Usage({ rowLimit, rowsUsed }: UsageProps) {
  return (
    <div className="flex flex-col py-12">
      <div className="@4xl:grid-cols-3 grid grid-cols-1 gap-x-8">
        <div className="pb-8">
          <h2 className="text-md font-semibold">Usage</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Mapform usage is based on the number of rows in your workspace
            across projects and datasets.
          </p>
        </div>
        <div className="@4xl:col-span-2 grid-cols-1 space-y-6">
          <div className="inline-flex flex-col gap-3">
            <Label>Rows Used</Label>
            <div className="inline-grid grid-flow-col grid-rows-4 gap-1">
              {Array.from(Array(BLOCKS).keys()).map((b) => {
                const block = b + 1;

                return (
                  <div
                    className={cn("size-3 rounded-sm border", {
                      "bg-primary border-primary":
                        (block * rowLimit) / BLOCKS <= rowsUsed,
                      "bg-gray-100":
                        (block * rowLimit) / BLOCKS > rowsUsed &&
                        (block * rowLimit) / BLOCKS <
                          rowsUsed + rowLimit / BLOCKS,
                    })}
                    key={block}
                  />
                );
              })}
            </div>
            <div className="text-muted-foreground text-sm">
              {rowsUsed} / {rowLimit} Rows
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
