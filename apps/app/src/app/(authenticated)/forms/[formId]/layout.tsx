import { prisma } from "@mapform/db";
import { Nav } from "./nav";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { formId: string };
}) {
  const form = await prisma.form.findUnique({
    where: {
      id: params.formId,
    },
  });

  if (!form) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col">
      <Nav form={form} />
      {children}
    </div>
  );
}
