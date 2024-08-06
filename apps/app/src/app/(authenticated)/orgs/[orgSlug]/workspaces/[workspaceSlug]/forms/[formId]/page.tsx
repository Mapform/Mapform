import { MapProvider } from "@mapform/mapform";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Tabs } from "~/components/tabs";
import { getFormWithSteps } from "~/data/forms/get-form-with-steps";
import { Container } from "./container";
import { TabActions } from "./tab-actions";

export default async function Workspace({
  params,
}: {
  params: { orgSlug: string; workspaceSlug: string; formId: string };
}) {
  const { orgSlug, workspaceSlug, formId } = params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["forms", formId],
    queryFn: async () =>
      (
        await getFormWithSteps({
          formId,
        })
      )?.data,
  });

  const tabs = [
    {
      name: "Create",
      href: `/orgs/${orgSlug}/workspaces/${workspaceSlug}/forms/${formId}`,
    },
    {
      name: "Submissions",
      href: `/orgs/${orgSlug}/workspaces/${workspaceSlug}/forms/${formId}/submissions`,
    },
  ];
  return (
    <Tabs action={<TabActions />} name="Some form" tabs={tabs}>
      <div className="-m-6 flex flex-col flex-1">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <MapProvider>
            <Container formId={params.formId} />
          </MapProvider>
        </HydrationBoundary>
      </div>
    </Tabs>
  );
}
