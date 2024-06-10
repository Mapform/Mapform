import React from "react";
import { cookies } from "next/headers";
import { type FormSubmission, type ShortTextInputResponse } from "@mapform/db";
import { Map } from "./map";
import { getFormWithSteps, getInputValues, getSession } from "./requests";

// The DRAFT FormID
export default async function Page({ params }: { params: { formId: string } }) {
  const formWithSteps = await getFormWithSteps(params.formId);
  const cookieStore = cookies();
  const cookie = cookieStore.get("mapform-form-submission");
  const formValues: ShortTextInputResponse[] = [];
  let session: FormSubmission | null = null;

  if (!formWithSteps) {
    return <div>Form not found</div>;
  }

  if (!formWithSteps.steps.length) {
    return <div>Form has no steps</div>;
  }

  if (cookie) {
    session = await getSession(cookie.value);

    if (session && session.formId === formWithSteps.id) {
      const inputValues = await getInputValues(session.id);
      formValues.push(...inputValues);
    }
  }

  return (
    <Map
      formValues={formValues}
      formWithSteps={formWithSteps}
      // We clear the session id if the form id doesn't match the current form
      sessionId={session?.formId === formWithSteps.id ? session.id : null}
    />
  );
}
