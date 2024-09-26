ALTER TABLE "dataset" DROP CONSTRAINT "dataset_project_id_project_id_fk";
--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "dataset_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_dataset_id_dataset_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."dataset"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "dataset" DROP COLUMN IF EXISTS "project_id";