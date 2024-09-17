import { MapProvider } from "@mapform/mapform";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getStepData } from "~/data/steps/get-step-data";
import { getFormWithSteps } from "~/data/forms/get-form-with-steps";
import { Container } from "./container";

export default async function Workspace({
  params,
  searchParams,
}: {
  params: { orgSlug: string; workspaceSlug: string; formId: string };
  searchParams?: {
    s?: string;
  };
}) {
  const { formId } = params;
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        refetchInterval: 1000 * 60 * 5,
      },
    },
  });
  await queryClient.prefetchQuery({
    queryKey: ["forms", formId],
    queryFn: async () =>
      (
        await getFormWithSteps({
          formId,
        })
      )?.data,
  });

  // if (!searchParams?.s) {
  //   return null;
  // }

  const stepData = await getStepData({
    stepId: searchParams?.s ?? "",
  });

  return (
    <div className="-m-4 flex flex-col flex-1 overflow-hidden">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MapProvider>
          <Container formId={params.formId} points={stepData?.data ?? []} />
        </MapProvider>
      </HydrationBoundary>
    </div>
  );
}
