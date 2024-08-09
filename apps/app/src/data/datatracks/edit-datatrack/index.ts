"use server";

import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { editDataTrackSchema } from "./schema";

export const deleteDatatrack = authAction
  .schema(editDataTrackSchema)
  .action(async ({ parsedInput: { datatrackId }, ctx: { userId } }) => {
    const dataTrack = await prisma.dataTrack.delete({
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
