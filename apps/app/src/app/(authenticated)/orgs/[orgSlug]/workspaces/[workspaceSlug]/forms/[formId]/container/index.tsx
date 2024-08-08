"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@mapform/lib/classnames";
import { getFormWithSteps } from "~/data/forms/get-form-with-steps";
import { Steps } from "./steps";
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
      <div
        // Grid: bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]
        className={cn(
          "flex flex-col flex-1 overflow-hidden bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
          // {
          //   invisible: !mapformLoaded,
          //   opacity: mapformLoaded ? 1 : 0,
          // }
        )}
      >
        {/* <div className="flex flex-1 overflow-hidden"> */}
        {/* MAP */}
        <MapFormContainer setMapformLoaded={setMapformLoaded} />

        {/* SIDEBAR */}
        {/* <Sidebar /> */}
        {/* </div> */}

        {/* STEPS */}
        <Steps />
      </div>
    </ContainerProvider>
  );
}
