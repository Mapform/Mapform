import { Stripe } from "stripe";
import { db } from "..";
import { env } from "../env.mjs";
import { plans } from "../schema";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY);

async function runDataMigration() {
  // get existing workspaces with user
  const workspaces = await db.query.workspaces.findMany({
    with: {
      workspaceMemberships: {
        with: {
          user: true,
        },
      },
    },
  });

  await Promise.all(
    workspaces.map(async (workspace) => {
      // Create a Stripe customer for each workspace
      const email = workspace.workspaceMemberships[0]?.user.email;

      if (!email) {
        throw new Error(`No email found for workspace with ID ${workspace.id}`);
      }

      const customer = await stripe.customers.create({
        name: workspace.name, // Workspace name
        email, // Billing email associated with the workspace
      });

      // Create a plan for each workspace
      await db.insert(plans).values({
        name: "Basic",
        workspaceSlug: workspace.slug,
        stripeCustomerId: customer.id,
        rowLimit: 100,
      });
    }),
  );

  console.log("Data migration completed!");
}

runDataMigration()
  .then(() => {
    console.log("Migration finished successfully");
    process.exit(0); // Exit the process when done
  })
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1); // Exit with error status
  });
