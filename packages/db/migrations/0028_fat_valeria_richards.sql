CREATE TABLE IF NOT EXISTS "blob" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"url" varchar(2048) NOT NULL,
	"size" integer NOT NULL,
	"queued_for_deletion_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blob_url_unique" UNIQUE("url")
);
