import { prisma } from "@mapform/db";

export default async function Settings({
  params,
}: {
  params: { orgSlug: string };
}) {
  return <div>Settings</div>;
}
