import { serve } from "inngest/next";
import { inngest } from "~/inngest/client";
import { createUser, updateUser, deleteUser } from "~/inngest/sync-user";
import { createOrg, updateOrg, deleteOrg } from "~/inngest/sync-org";
import {
  createOrgMembership,
  updateOrgMembership,
  deleteOrgMembership,
} from "~/inngest/sync-org-membership";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    // Users
    createUser,
    updateUser,
    deleteUser,
    // Orgs
    createOrg,
    updateOrg,
    deleteOrg,
    // Org Memberships
    createOrgMembership,
    updateOrgMembership,
    deleteOrgMembership,
  ],
});
