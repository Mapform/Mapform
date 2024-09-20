"use client";

import { useQuery } from "@tanstack/react-query";
import { cn } from "@mapform/lib/classnames";
import type { GetStepData } from "~/data/steps/get-step-data";
import { getFormWithSteps } from "~/data/forms/get-form-with-steps";
import { ContainerProvider } from "./context";
import MapFormContainer from "./mapform-container";

export function Container({
  formId,
  points,
}: {
  formId: string;
  points: GetStepData;
}) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["forms", formId],
    queryFn: async () => {
      const formWithSteps = await getFormWithSteps({ formId });

      return formWithSteps?.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <ContainerProvider formWithSteps={data} points={points}>
      <div className={cn("flex flex-col flex-1 overflow-hidden bg-background")}>
        <MapFormContainer />
      </div>
    </ContainerProvider>
  );
}
