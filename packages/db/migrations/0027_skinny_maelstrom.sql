CREATE TYPE "public"."ending_type" AS ENUM('redirect', 'page');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ending" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_id" uuid NOT NULL,
	"ending_type" "ending_type" DEFAULT 'page' NOT NULL,
	"redirect_url" text,
	"page_title" text,
	"page_content" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ending" ADD CONSTRAINT "ending_page_id_page_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."page"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
