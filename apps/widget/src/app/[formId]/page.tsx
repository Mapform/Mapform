import React from "react";
import { cookies } from "next/headers";
import { type Row } from "@mapform/db";
import { Map } from "./map";
import {
  getFormWithSteps,
  getInputValues,
  getLocationValues,
  getResponses,
  getSession,
} from "./requests";

// The DRAFT FormID
export default async function Page({ params }: { params: { formId: string } }) {
  const formWithSteps = await getFormWithSteps(params.formId);
  const cookieStore = cookies();
  const cookie = cookieStore.get("mapform-form-submission");
  const formValues: {
    id: string;
    blockNoteId: string;
    // TODO: Use the correct type
    value: any;
    type: "textInput" | "pin";
  }[] = [];
  let session: Row | null = null;

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
      console.log(111111, responses);
      // const values = await Promise.all([
      // getInputValues(session.id),
      // getLocationValues(session.id),
      // ]);

      // formValues.push(
      //   // Text input
      //   ...values[0].map((v) => ({
      //     id: v.blockNoteId,
      //     blockNoteId: v.blockNoteId,
      //     value: v.value,
      //     type: "textInput" as const,
      //   })),
      //   ...values[1].map((v) => ({
      //     id: v.blockNoteId,
      //     blockNoteId: v.blockNoteId,
      //     value: {
      //       latitude: v.latitude,
      //       longitude: v.longitude,
      //     },
      //     type: "pin" as const,
      //   }))
      // );
    }
  }

  return (
    <Map
      formValues={formValues}
      formWithSteps={formWithSteps}
      // We clear the session id if the form id doesn't match the current form
      sessionId={
        session?.publishedFormId === formWithSteps.id ? session.id : null
      }
    />
  );
}
