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
import type { StepType } from "@mapform/db";
import { deleteStep } from "../../actions";

const steps: { value: StepType; label: string }[] = [
  { value: "SHORT_TEXT", label: "Short Text" },
  { value: "LONG_TEXT", label: "Long Text" },
  { value: "CONTENT", label: "Content" },
  { value: "YES_NO", label: "Yes / No" },
];

export function Sidebar({ stepId }: { stepId?: string }) {
  return (
    <div className="w-[400px] border-l p-4">
      {stepId ? (
        <>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {steps.map((step) => (
                <SelectItem key={step.value} value={step.value}>
                  {step.label}
                </SelectItem>
              ))}
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
