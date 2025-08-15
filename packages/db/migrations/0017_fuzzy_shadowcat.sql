ALTER TABLE "blob" DROP CONSTRAINT "blob_project_id_project_id_fk";
--> statement-breakpoint
ALTER TABLE "blob" DROP CONSTRAINT "blob_row_id_row_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blob" ADD CONSTRAINT "blob_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blob" ADD CONSTRAINT "blob_row_id_row_id_fk" FOREIGN KEY ("row_id") REFERENCES "public"."row"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
