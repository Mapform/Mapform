"use server";

import { cookies } from "next/headers";
import { publicClient } from "~/lib/safe-action";

export const createSubmissionAction = async (
  params: Last<Parameters<typeof publicClient.createSubmission>>,
) => {
  const projectId = params.projectId;
  const result = await publicClient.createSubmission(params);

  if (!result?.data) {
    throw new Error("Submission not created");
  }

  (await cookies()).set("mapform-submission", result.data.id);
  (await cookies()).set("mapform-project-id", projectId);

  return result.data.id;
};
