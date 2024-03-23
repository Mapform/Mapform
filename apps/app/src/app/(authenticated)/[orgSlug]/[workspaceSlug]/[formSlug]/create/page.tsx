import { MapProvider } from "@mapform/mapform";
import { getForm, getLocation } from "./actions";
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

  if (form?.steps[0]?.locationId) {
    const location = await getLocation(form?.steps[0]?.locationId);
    console.log(99999, location);
  }

  if (!form) {
    // TODO: 404
    return <div>Form not found</div>;
  }

  return (
    <MapProvider>
      <Container form={form} />
    </MapProvider>
  );
}
