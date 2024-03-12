import { inngest } from "./client";
import { prisma } from "@mapform/db";

export const syncUser = inngest.createFunction(
  { id: "sync-user-from-clerk" }, // ←The 'id' is an arbitrary string used to identify the function in the dashboard
  { event: "clerk/user.created" }, // ← This is the function's triggering event
  async ({ event }) => {
    const user = event.data; // The event payload's data will be the Clerk User json object

    const { id, first_name, last_name } = user;
    const email = user.email_addresses.find(
      (e: { id: string }) => e.id === user.primary_email_address_id
    )?.email_address;

    await prisma.user.create({
      data: {
        id,
        firstName: first_name,
        lastName: last_name,
        email,
      },
    });
  }
);
