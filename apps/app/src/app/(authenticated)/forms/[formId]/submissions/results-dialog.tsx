"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@mapform/ui/components/dialog";
import { Button } from "@mapform/ui/components/button";
import type { TextInputBlock, CustomBlock, PinBlock } from "@mapform/blocknote";
import { type FormSubmissions } from "./requests";

interface ResultsDialogProps {
  formSubmission: FormSubmissions[number];
}

export function ResultsDialog({ formSubmission }: ResultsDialogProps) {
  const stepOrder = formSubmission.form.stepOrder;

  const getResults = (): {
    id: string;
    title?: string;
    value: string;
    step: number;
    type: string;
  }[] => {
    const inputResponses = formSubmission.inputResponses.map((response) => {
      const step = formSubmission.form.steps.find(
        (s) => s.id === response.step.id
      );
      const block = getBlockById(
        step?.description?.content || [],
        response.blockNoteId
      ) as TextInputBlock | null;

      return {
        id: response.id,
        title: block?.props.label,
        value: response.value,
        step: stepOrder.indexOf(response.step.id) + 1,
        type: "Short Text Input",
      };
    });

    const locationResponses = formSubmission.locationResponses.map(
      (response) => {
        const step = formSubmission.form.steps.find(
          (s) => s.id === response.step.id
        );
        const block = getBlockById(
          step?.description?.content || [],
          response.blockNoteId
        ) as PinBlock | null;

        return {
          id: response.id,
          title: block?.props.text,
          value: `${response.location.latitude}, ${response.location.longitude}`,
          step: stepOrder.indexOf(response.step.id) + 1,
          type: "Pin",
        };
      }
    );

    return [...inputResponses, ...locationResponses];
  };

  return (
    <Dialog>
      <DialogTrigger asChild className="-ml-3">
        <Button size="sm" variant="ghost">
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-0 max-w-screen-md">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Results</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto px-6 pb-2">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  scope="col"
                >
                  Name
                </th>
                <th
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  scope="col"
                >
                  Value
                </th>
                <th
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  scope="col"
                >
                  Step
                </th>
                <th
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  scope="col"
                >
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {getResults().map((result) => (
                <tr key={result.id}>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:pl-0">
                    {result.title}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {result.value}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {result.step}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {result.type}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Recursively step through the blocks to find the block with the given ID.
 */
function getBlockById(blocks: CustomBlock[], id: string): CustomBlock | null {
  for (const block of blocks) {
    if (block.id === id) {
      return block;
    }

    const foundBlock = getBlockById(block.children, id);
    if (foundBlock) {
      return foundBlock;
    }
  }

  return null;
}
