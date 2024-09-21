import { notFound } from "next/navigation";
import { getPage } from "~/data/pages/get-page";
import PageContent from "./page-content";

export default async function Page({
  params,
}: {
  params: { wsSlug: string; tsSlug: string; projectId: string; pageId: string };
}) {
  const { pageId } = params;
  const pageResponse = await getPage({
    id: pageId,
  });
  const page = pageResponse?.data;

  if (!page) {
    return notFound();
  }

  return <PageContent page={page} />;
}
