"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@mapform/ui/components/dialog";
import { Button } from "@mapform/ui/components/button";
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
      return {
        id: response.id,
        value: response.value,
        step: stepOrder.indexOf(response.step.id) + 1,
        type: "Short Text Input",
      };
    });

    const locationResponses = formSubmission.locationResponses.map(
      (response) => {
        return {
          id: response.id,
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
