import { inngest } from "./client";
import { prisma } from "@mapform/db";

type ClerkOrganizationData = {
  id: string;
  name: string;
  slug: string;
  iamge_url?: string;
};

export const createOrg = inngest.createFunction(
  { id: "create-org-from-clerk" },
  { event: "clerk/organization.created" },
  async ({ event }) => {
    const org = event.data as ClerkOrganizationData;

    const { id, name, slug, iamge_url } = org;

    await prisma.organization.create({
      data: {
        id,
        name,
        slug,
        imageUrl: iamge_url,
      },
    });
  }
);

export const updateOrg = inngest.createFunction(
  { id: "update-org-from-clerk" },
  { event: "clerk/organization.updated" },
  async ({ event }) => {
    const org = event.data as ClerkOrganizationData;

    const { id, name, slug, iamge_url } = org;

    await prisma.organization.update({
      where: {
        id,
      },
      data: {
        id,
        name,
        slug,
        imageUrl: iamge_url,
      },
    });
  }
);

export const deleteOrg = inngest.createFunction(
  { id: "delete-org-from-clerk" },
  { event: "clerk/organization.deleted" },
  async ({ event }) => {
    const org = event.data as ClerkOrganizationData;

    const { id } = org;

    await prisma.organization.delete({
      where: {
        id,
      },
    });
  }
);
