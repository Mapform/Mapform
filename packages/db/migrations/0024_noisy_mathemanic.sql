CREATE TABLE IF NOT EXISTS "plan" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(64) NOT NULL,
	"stripe_customer_id" text NOT NULL,
	"stripe_subscription_id" text,
	"stripe_product_id" text,
	"subscription_status" varchar(20),
	"position" integer NOT NULL,
	"workspace_slug" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "plan_stripe_customer_id_unique" UNIQUE("stripe_customer_id"),
	CONSTRAINT "plan_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id"),
	CONSTRAINT "plan_workspace_slug_unique" UNIQUE("workspace_slug")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "plan" ADD CONSTRAINT "plan_workspace_slug_workspace_slug_fk" FOREIGN KEY ("workspace_slug") REFERENCES "public"."workspace"("slug") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
