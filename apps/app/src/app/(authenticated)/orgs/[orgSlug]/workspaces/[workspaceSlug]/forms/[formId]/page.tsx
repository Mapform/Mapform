import { MapProvider } from "@mapform/mapform";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getFormWithSteps } from "~/data/forms/get-form-with-steps";
import { Container } from "./container";

export default async function Workspace({
  params,
}: {
  params: { orgSlug: string; workspaceSlug: string; formId: string };
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

  return (
    <div className="-m-4 flex flex-col flex-1 overflow-hidden">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MapProvider>
          <Container formId={params.formId} />
        </MapProvider>
      </HydrationBoundary>
    </div>
  );
}
