import React from "react";
import { cookies } from "next/headers";
import { type FormSubmission, type ShortTextInputResponse } from "@mapform/db";
import { Map } from "./map";
import {
  getFormWithSteps,
  getFormWithStepsFromDraftId,
  getInputValues,
  getSession,
} from "./requests";

export default async function Page({ params }: { params: { formId: string } }) {
  const cookieStore = cookies();
  const cookie = cookieStore.get("mapform-form-submission");
  const formValues: ShortTextInputResponse[] = [];
  let session: FormSubmission | null = null;
  let formWithSteps = null;

  if (cookie) {
    session = await getSession(cookie.value);

    if (session) {
      formWithSteps = await getFormWithSteps(session.formId);
      const inputValues = await getInputValues(session.id);
      formValues.push(...inputValues);
    }
  }

  if (!formWithSteps) {
    formWithSteps = await getFormWithStepsFromDraftId(params.formId);

    if (!formWithSteps) {
      return <div>Form not found</div>;
    }
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
