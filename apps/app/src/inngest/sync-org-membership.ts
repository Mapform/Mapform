import { inngest } from "./client";
import { prisma } from "@mapform/db";

type ClerkOrganizationMembershipData = {
  id: string;
  organization: {
    id: string;
  };
  public_user_data: {
    user_id: string;
  };
  role: string;
};

export const createOrgMembership = inngest.createFunction(
  { id: "create-org-membership-from-clerk" },
  { event: "clerk/organizationMembership.created" },
  async ({ event }) => {
    const orgMembership = event.data as ClerkOrganizationMembershipData;

    const { id, organization, public_user_data } = orgMembership;

    await prisma.organizationMembership.create({
      data: {
        id,
        userId: public_user_data.user_id,
        organizationId: organization.id,
        role: orgMembership.role,
      },
    });
  }
);

export const updateOrgMembership = inngest.createFunction(
  { id: "update-org-membership-from-clerk" },
  { event: "clerk/organizationMembership.updated" },
  async ({ event }) => {
    const orgMembership = event.data as ClerkOrganizationMembershipData;

    const { id, organization, public_user_data } = orgMembership;

    await prisma.organizationMembership.update({
      where: {
        id,
      },
      data: {
        id,
        userId: public_user_data.user_id,
        organizationId: organization.id,
        role: orgMembership.role,
      },
    });
  }
);

export const deleteOrgMembership = inngest.createFunction(
  { id: "delete-org-membership-from-clerk" },
  { event: "clerk/organizationMembership.deleted" },
  async ({ event }) => {
    const orgMembership = event.data as ClerkOrganizationMembershipData;

    const { id } = orgMembership;

    await prisma.organizationMembership.delete({
      where: {
        id,
      },
    });
  }
);
