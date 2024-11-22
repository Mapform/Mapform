ALTER TABLE "project" DROP CONSTRAINT "project_dataset_id_dataset_id_fk";
--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "dataset_id" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_dataset_id_dataset_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."dataset"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
