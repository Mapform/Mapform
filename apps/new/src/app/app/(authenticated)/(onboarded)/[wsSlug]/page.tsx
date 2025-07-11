import { notFound } from "next/navigation";

import { authClient } from "~/lib/safe-action";
import { getWorkspaceDirectory } from "~/data/workspaces/get-workspace-directory";

import { WelcomeTour } from "./welcome-tour";

export default async function HomePage(props: {
  params: Promise<{ wsSlug: string }>;
}) {
  const params = await props.params;
  const [getWorkspaceDirectoryResponse] = await Promise.all([
    getWorkspaceDirectory({
      slug: params.wsSlug,
    }),
  ]);
  const workspaceDirectory = getWorkspaceDirectoryResponse?.data;

  if (!workspaceDirectory) {
    return notFound();
  }

  return (
    <>
      <WelcomeTour />
    </>
  );
}
