import { Button } from "@mapform/ui/components/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@mapform/ui/components/select";
import { deleteStep } from "../../actions";

export function Sidebar({ stepId }: { stepId?: string }) {
  return (
    <div className="w-[400px] border-l p-4">
      {stepId ? (
        <>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => deleteStep(stepId)} variant="destructive">
            Delete Step
          </Button>
        </>
      ) : null}
    </div>
  );
}
