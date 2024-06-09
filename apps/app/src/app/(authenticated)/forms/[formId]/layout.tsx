import { Nav } from "./nav";
import { getForm } from "./requests";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { formId: string };
}) {
  const form = await getForm(params.formId);

  if (!form) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Nav form={form} />
      <div className="overflow-y-auto flex-1 flex flex-col">{children}</div>
    </div>
  );
}
