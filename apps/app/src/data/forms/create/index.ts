"use server";

import slugify from "slugify";
import { prisma } from "@mapform/db";
// import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { createFormSchema } from "./schema";

const initialViewState = {
  longitude: -122.4,
  latitude: 37.8,
  zoom: 14,
  bearing: 0,
  pitch: 0,
};

export const createForm = authAction
  .schema(createFormSchema)
  .action(async ({ parsedInput: { name, workspaceId }, ctx: { userId } }) => {
    // TODO: We should be able to get the IP address geo info from this, but only when hosted on Vercel.
    // https://stackoverflow.com/questions/75532475/how-can-i-get-the-ip-adress-of-a-client-in-server-component-of-the-app-directory#:~:text=You%20can%20use%20the%20nextjs,header%20in%20your%20server%20component.
    // const forwardedFor = headers().get("x-forwarded-for");

    const slug = slugify(name, {
      lower: true,
      strict: true,
    });

    const workspace = await prisma.workspace.findUnique({
      where: {
        id: workspaceId,
        organization: {
          members: {
            some: {
              userId,
            },
          },
        },
      },
    });

    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const newForm = await prisma.form.create({
      data: {
        slug,
        name,
        isRoot: true,
        workspace: {
          connect: {
            id: workspaceId,
          },
        },
        dataset: {
          create: {
            name: `${name} dataset`,
            workspaceId,
          },
        },
      },
    });

    /**
     * Add a default step
     */
    await prisma.step.createWithLocation({
      formId: newForm.id,
      zoom: initialViewState.zoom,
      pitch: initialViewState.pitch,
      bearing: initialViewState.bearing,
      latitude: initialViewState.latitude,
      longitude: initialViewState.longitude,
    });

    revalidatePath("/");
  });
