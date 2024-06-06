"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@mapform/ui/components/spinner";
import { cn } from "@mapform/lib/classnames";
import { getFormWithSteps } from "~/server/actions/forms/get-form-with-steps";
import { Steps } from "./steps";
import { Sidebar } from "./sidebar";
import { ContainerProvider } from "./context";
import { MapFormContainer } from "./mapform-container";

export function Container({ formId }: { formId: string }) {
  const [mapformLoaded, setMapformLoaded] = useState(false);
  const { data, error, isLoading } = useQuery({
    queryKey: ["forms", formId],
    queryFn: async () => {
      const formWithSteps = await getFormWithSteps({ formId });

      return formWithSteps.data;
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

  // Radial gradient in case I want to add back bg-[radial-gradient(#e5e7eb_1px,transparent_1px)][background-size:16px_16px]"
  return (
    <ContainerProvider formWithSteps={data}>
      <div className="relative flex flex-col flex-1 bg-gray-50">
        {mapformLoaded ? null : (
          <div className="absolute inset-0 flex justify-center items-center">
            <Spinner variant="dark" />
          </div>
        )}
        <div
          className={cn(
            "flex flex-col flex-1  transition-all duration-300 ease-in-out",
            {
              invisible: !mapformLoaded,
              opacity: mapformLoaded ? 1 : 0,
            }
          )}
        >
          <div className="flex flex-1">
            {/* MAP */}
            <MapFormContainer setMapformLoaded={setMapformLoaded} />

            {/* SIDEBAR */}
            <Sidebar />
          </div>

          {/* STEPS */}
          <Steps />
        </div>
      </div>
    </ContainerProvider>
  );
}
