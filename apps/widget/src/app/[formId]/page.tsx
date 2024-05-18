import React from "react";
import { Map } from "./map";
import { getFormWithSteps } from "./getters";

export default async function Page({ params }: { params: { formId: string } }) {
  const formWithSteps = await getFormWithSteps(params.formId);

  if (!formWithSteps) {
    return <div>Form not found</div>;
  }

  if (!formWithSteps.steps.length) {
    return <div>Form has no steps</div>;
  }

  return <Map formWithSteps={formWithSteps} />;
}
