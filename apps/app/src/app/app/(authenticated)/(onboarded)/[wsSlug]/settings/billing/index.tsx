import { Badge } from "@mapform/ui/components/badge";
import { ProButtons } from "./pro-buttons";
import { PLANS } from "@mapform/lib/constants/plans";
import type { WorkspaceDirectory } from "@mapform/backend/data/workspaces/get-workspace-directory";
import { BasicButtons } from "./basic-buttons";

export function Billing({
  plan,
  workspaceSlug,
}: {
  plan: NonNullable<NonNullable<WorkspaceDirectory["data"]>["plan"]>;
  workspaceSlug: string;
}) {
  return (
    <div className="flex flex-col pb-12">
      <div className="@4xl:grid-cols-3 grid grid-cols-1 gap-x-8">
        <div className="pb-8">
          <h2 className="text-md font-semibold">Active Plan</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Your current plan is <Badge>{plan.name}</Badge>
          </p>
        </div>
        <div className="@4xl:col-span-2 grid-cols-1 space-y-6">
          <div className="grid grid-cols-2">
            <div className="">
              <div className="">{PLANS.basic.name}</div>
              <BasicButtons plan={plan} workspaceSlug={workspaceSlug} />
            </div>
            <div className="">
              <div className="">{PLANS.pro.name}</div>
              <ProButtons plan={plan} workspaceSlug={workspaceSlug} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
