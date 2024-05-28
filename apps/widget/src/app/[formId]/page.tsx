import React from "react";
import { cookies } from "next/headers";
import { type ShortTextInputResponse } from "@mapform/db";
import { Map } from "./map";
import { getFormWithSteps, getInputValues } from "./getters";

export default async function Page({ params }: { params: { formId: string } }) {
  const formWithSteps = await getFormWithSteps(params.formId);
  const cookieStore = cookies();
  const session = cookieStore.get("mapform-form-submission");
  const formValues: ShortTextInputResponse[] = [];

  if (session) {
    const inputValues = await getInputValues(session.value);
    formValues.push(...inputValues);
  }

  if (!formWithSteps) {
    return <div>Form not found</div>;
  }

  if (!formWithSteps.steps.length) {
    return <div>Form has no steps</div>;
  }

  return <Map formWithSteps={formWithSteps} formValues={formValues} />;
}
