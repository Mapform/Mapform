import { MapProvider } from "@mapform/mapform";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getProjectWithPages } from "~/data/projects/get-project-with-pages";
import { Container } from "./container";

export default async function Workspace({
  params,
}: {
  params: { wsSlug: string; tsSlug: string; pId: string };
  searchParams?: {
    p?: string;
  };
}) {
  const { pId } = params;
  // const queryClient = new QueryClient({
  //   defaultOptions: {
  //     queries: {
  //       staleTime: 1000 * 60 * 5,
  //       refetchInterval: 1000 * 60 * 5,
  //     },
  //   },
  // });
  // await queryClient.prefetchQuery({
  //   queryKey: ["projects", pId],
  //   queryFn: async () =>
  //     (
  //       await getProjectWithPages({
  //         id: pId,
  //       })
  //     )?.data,
  // });
  const projectWithPages = await getProjectWithPages({
    id: pId,
  });

  console.log(99999, projectWithPages);

  return (
    <div className="-m-4 flex flex-col flex-1 overflow-hidden">
      {/* <HydrationBoundary state={dehydrate(queryClient)}> */}
      <MapProvider>
        Project
        {/* <Container formId={params.formId} points={stepData?.data ?? []} /> */}
      </MapProvider>
      {/* </HydrationBoundary> */}
    </div>
  );
}
