import { Stripe } from "stripe";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { env } from "../env.mjs";
import * as schema from "../schema";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: env.DATABASE_URL });
export const db = drizzle(pool, { schema });

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

  for (const workspace of workspaces) {
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
    await db.insert(schema.plans).values({
      name: "Basic",
      workspaceSlug: workspace.slug,
      stripeCustomerId: customer.id,
      rowLimit: 100,
    });

    // Add 1 second delay between iterations
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

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
