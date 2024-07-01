import { MapProvider } from "@mapform/mapform";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getFormWithSteps } from "~/server/actions/forms/get-form-with-steps";
import { Container } from "./container";
import { getNearbyPoints } from "./requests";

export default async function Workspace({
  params,
}: {
  params: { formId: string };
}) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["forms", params.formId],
    queryFn: async () =>
      (
        await getFormWithSteps({
          formId: params.formId,
        })
      ).data,
  });

  await getNearbyPoints();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MapProvider>
        <Container formId={params.formId} />
      </MapProvider>
    </HydrationBoundary>
  );
}
