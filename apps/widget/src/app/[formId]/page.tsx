import React from "react";
import { cookies } from "next/headers";
import { type FormSubmission, type ShortTextInputResponse } from "@mapform/db";
import { Map } from "./map";
import { getFormWithSteps, getInputValues, getSession } from "./requests";

export default async function Page({ params }: { params: { formId: string } }) {
  const formWithSteps = await getFormWithSteps(params.formId);
  const cookieStore = cookies();
  const cookie = cookieStore.get("mapform-form-submission");
  const formValues: ShortTextInputResponse[] = [];
  let session: FormSubmission | null = null;

  if (cookie) {
    session = await getSession(cookie.value);

    if (session) {
      const inputValues = await getInputValues(session.id);
      formValues.push(...inputValues);
    }
  }

  if (!formWithSteps) {
    return <div>Form not found</div>;
  }

  if (!formWithSteps.steps.length) {
    return <div>Form has no steps</div>;
  }

  return (
    <Map
      formValues={formValues}
      formWithSteps={formWithSteps}
      sessionId={session?.id || null}
    />
  );
}
