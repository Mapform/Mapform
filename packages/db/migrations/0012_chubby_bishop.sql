CREATE TABLE IF NOT EXISTS "cover_photo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid,
	"row_id" uuid,
	"blob_id" uuid NOT NULL,
	"title" varchar(256),
	"author" varchar(256),
	"source" varchar(512),
	"license" varchar(256),
	"position" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cover_photo_blob_id_unique" UNIQUE("blob_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cover_photo" ADD CONSTRAINT "cover_photo_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cover_photo" ADD CONSTRAINT "cover_photo_row_id_row_id_fk" FOREIGN KEY ("row_id") REFERENCES "public"."row"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cover_photo" ADD CONSTRAINT "cover_photo_blob_id_blob_id_fk" FOREIGN KEY ("blob_id") REFERENCES "public"."blob"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "project" DROP COLUMN IF EXISTS "cover_photos";