import { MapProvider } from "@mapform/mapform";
import { Container } from "./container";
import { getFormWithSteps } from "./requests";

export default async function Workspace({
  params,
}: {
  params: { formId: string };
}) {
  const formWithSteps = await getFormWithSteps({
    formId: params.formId,
  });

  return (
    <MapProvider>
      <Container formWithSteps={formWithSteps} />
    </MapProvider>
  );
}
