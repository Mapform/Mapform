import { MapProvider } from "@mapform/mapform";
import { getForm, getLocation, getSteps } from "./actions";
import { Container } from "./container";

export default async function Workspace({
  params,
}: {
  params: { formSlug: string; orgSlug: string; workspaceSlug: string };
}) {
  const form = await getForm(
    params.formSlug.toLocaleLowerCase(),
    params.workspaceSlug.toLocaleLowerCase(),
    params.orgSlug.toLocaleLowerCase()
  );

  if (!form) {
    return <div>Form does not exist.</div>;
  }

  const steps = await getSteps(form.id);

  return (
    <MapProvider>
      <Container form={form} steps={steps} />
    </MapProvider>
  );
}
