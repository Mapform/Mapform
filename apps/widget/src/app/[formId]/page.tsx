import React from "react";
import { cookies } from "next/headers";
import { type FormSubmission } from "@mapform/db";
import { type GetStepData, getStepData } from "~/data/get-step-data";
import { Map } from "./map";
import {
  getFormWithSteps,
  getResponses,
  getSession,
  type Responses,
} from "./requests";

// The DRAFT FormID
export default async function Page({
  params,
  searchParams,
}: {
  params: { formId: string };
  searchParams?: { s?: string };
}) {
  const formWithSteps = await getFormWithSteps(params.formId);
  const cookieStore = cookies();
  const cookie = cookieStore.get("mapform-form-submission");
  const formValues: NonNullable<Responses> = [];
  const s = searchParams?.s;

  let session: FormSubmission | null = null;
  let stepData = null;

  if (!formWithSteps) {
    return <div>Form not found</div>;
  }

  if (!formWithSteps.steps.length) {
    return <div>Form has no steps</div>;
  }

  if (cookie) {
    session = await getSession(cookie.value, formWithSteps.id);

    if (session && session.publishedFormId === formWithSteps.id) {
      const responses = await getResponses(session.id);

      formValues.push(...responses);
    }
  }

  if (s) {
    stepData = await getStepData({ stepId: s });
  }

  console.log(111111, stepData, s);

  return (
    <Map
      points={stepData?.data ?? []}
      formValues={formValues}
      formWithSteps={formWithSteps}
      // We clear the session id if the form id doesn't match the current form
      sessionId={
        session?.publishedFormId === formWithSteps.id ? session.id : null
      }
    />
  );
}
