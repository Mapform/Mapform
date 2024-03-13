import { inngest } from "./client";
import { prisma } from "@mapform/db";

export const createUser = inngest.createFunction(
  { id: "create-user-from-clerk" }, // ←The 'id' is an arbitrary string used to identify the function in the dashboard
  { event: "clerk/user.created" }, // ← This is the function's triggering event
  async ({ event }) => {
    const user = event.data; // The event payload's data will be the Clerk User json object

    const { id, first_name, last_name } = user;
    const email = user.email_addresses.find(
      (e: { id: string }) => e.id === user.primary_email_address_id
    )?.email_address;

    await prisma.user.create({
      data: {
        tenantId: id,
        firstName: first_name,
        lastName: last_name,
        email,
      },
    });
  }
);

export const updateUser = inngest.createFunction(
  { id: "update-user-from-clerk" }, // ←The 'id' is an arbitrary string used to identify the function in the dashboard
  { event: "clerk/user.updated" }, // ← This is the function's triggering event
  async ({ event }) => {
    const user = event.data; // The event payload's data will be the Clerk User json object

    const { id, first_name, last_name } = user;
    const email = user.email_addresses.find(
      (e: { id: string }) => e.id === user.primary_email_address_id
    )?.email_address;

    await prisma.user.update({
      where: {
        tenantId: id,
      },
      data: {
        id,
        firstName: first_name,
        lastName: last_name,
        email,
      },
    });
  }
);

export const deleteUser = inngest.createFunction(
  { id: "delete-user-from-clerk" }, // ←The 'id' is an arbitrary string used to identify the function in the dashboard
  { event: "clerk/user.deleted" }, // ← This is the function's triggering event
  async ({ event }) => {
    const user = event.data; // The event payload's data will be the Clerk User json object

    const { id } = user;

    await prisma.user.delete({
      where: {
        tenantId: id,
      },
    });
  }
);
