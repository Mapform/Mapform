ALTER TABLE "project" ADD COLUMN "position" smallint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "folder_id" uuid;--> statement-breakpoint
ALTER TABLE "folder" ADD COLUMN "position" smallint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "view" ADD COLUMN "position" smallint DEFAULT 0 NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_folder_id_folder_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folder"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "folder" DROP COLUMN IF EXISTS "order";