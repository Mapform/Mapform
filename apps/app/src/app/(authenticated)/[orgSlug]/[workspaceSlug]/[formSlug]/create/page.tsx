import { MapProvider } from "@mapform/mapform";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getFormWithSteps } from "./actions";
import { Container } from "./container";

export default async function Workspace({
  params,
}: {
  params: { formSlug: string; orgSlug: string; workspaceSlug: string };
}) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["forms", params.formSlug, params.workspaceSlug, params.orgSlug],
    queryFn: () =>
      getFormWithSteps(
        params.formSlug.toLocaleLowerCase(),
        params.workspaceSlug.toLocaleLowerCase(),
        params.orgSlug.toLocaleLowerCase()
      ),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MapProvider>
        <Container
          formSlug={params.formSlug}
          orgSlug={params.orgSlug}
          workspaceSlug={params.workspaceSlug}
        />
      </MapProvider>
    </HydrationBoundary>
  );
}
