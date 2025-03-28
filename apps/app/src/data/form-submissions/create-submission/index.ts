"use server";

import { cookies } from "next/headers";
import { publicClient } from "~/lib/safe-action";

export const createSubmissionAction = async (
  params: Last<Parameters<typeof publicClient.createSubmission>>,
) => {
  const result = await publicClient.createSubmission(params);

  if (!result?.data) {
    throw new Error("Submission not created");
  }

  (await cookies()).set("mapform-submission", result.data.id, {
    path: `/share/${params.projectId}`,
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 14, // 14 days
  });

  return result.data.id;
};
