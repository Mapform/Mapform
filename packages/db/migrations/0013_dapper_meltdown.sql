ALTER TABLE "cover_photo" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "cover_photo" CASCADE;--> statement-breakpoint
ALTER TABLE "blob" ADD COLUMN "project_id" uuid;--> statement-breakpoint
ALTER TABLE "blob" ADD COLUMN "row_id" uuid;--> statement-breakpoint
ALTER TABLE "blob" ADD COLUMN "title" varchar(512);--> statement-breakpoint
ALTER TABLE "blob" ADD COLUMN "author" varchar(256);--> statement-breakpoint
ALTER TABLE "blob" ADD COLUMN "license" varchar(256);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blob" ADD CONSTRAINT "blob_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blob" ADD CONSTRAINT "blob_row_id_row_id_fk" FOREIGN KEY ("row_id") REFERENCES "public"."row"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
