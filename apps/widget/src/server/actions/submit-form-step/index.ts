"use server";

import { formSchema } from "@mapform/lib/schemas/form-step-schema";
import { action } from "~/lib/safe-action";

export const submitFormStep = action(formSchema, async (obj) => {
  console.log(22222, obj);
  return { failure: "Incorrect credentials" };
});
