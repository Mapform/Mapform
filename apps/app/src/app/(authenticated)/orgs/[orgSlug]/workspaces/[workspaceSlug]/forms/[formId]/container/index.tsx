"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@mapform/lib/classnames";
import { getFormWithSteps } from "~/data/forms/get-form-with-steps";
import { ContainerProvider } from "./context";
import MapFormContainer from "./mapform-container";

export function Container({ formId }: { formId: string }) {
  const [mapformLoaded, setMapformLoaded] = useState(false);
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
    <ContainerProvider formWithSteps={data}>
      {/* {mapformLoaded ? null : (
        <div className="absolute inset-0 flex justify-center items-center">
          <Spinner variant="dark" />
        </div>
      )} */}
      <div className={cn("flex flex-col flex-1 overflow-hidden bg-background")}>
        <MapFormContainer setMapformLoaded={setMapformLoaded} />
        {/* <Steps /> */}
      </div>
    </ContainerProvider>
  );
}
