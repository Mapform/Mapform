import { cn } from "@mapform/lib/classnames";
import { Label } from "@mapform/ui/components/label";

// Hard-code for now. This will be dynamic in the future.
const ALLOWED_ROW_USAGE = 1000;
const BLOCKS = 100;

interface UsageProps {
  rowsUsed: number;
}

export function Usage({ rowsUsed }: UsageProps) {
  return (
    <div className="flex flex-col pb-12">
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
                        (block * ALLOWED_ROW_USAGE) / BLOCKS <= rowsUsed,
                      "bg-gray-100":
                        (block * ALLOWED_ROW_USAGE) / BLOCKS > rowsUsed &&
                        (block * ALLOWED_ROW_USAGE) / BLOCKS <=
                          rowsUsed + ALLOWED_ROW_USAGE / BLOCKS,
                    })}
                    key={block}
                  />
                );
              })}
            </div>
            <div className="text-muted-foreground text-sm">
              {rowsUsed} / {ALLOWED_ROW_USAGE} Rows
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
