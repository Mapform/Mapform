"use server";

import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { updateDataTrackSchema } from "./schema";

export const updateDataTrack = authAction
  .schema(updateDataTrackSchema)
  .action(async ({ parsedInput: { datatrackId }, ctx: { userId } }) => {
    const dataTrack = await prisma.dataTrack.update({
      data: {},
      where: {
        id: datatrackId,
        form: {
          workspace: {
            organization: {
              members: {
                some: {
                  userId,
                },
              },
            },
          },
        },
      },
      include: {
        form: {
          include: {
            workspace: {
              include: {
                organization: true,
              },
            },
          },
        },
      },
    });

    if (!dataTrack.form) {
      throw new Error("User does not have access to this organization.");
    }

    revalidatePath(
      `/orgs/${dataTrack.form.workspace.organization.slug}/workspaces/${dataTrack.form.workspace.slug}/forms/${dataTrack.form.id}`
    );
  });
