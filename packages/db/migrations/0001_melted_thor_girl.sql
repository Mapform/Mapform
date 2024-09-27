DO $$ BEGIN
 CREATE TYPE "public"."dataset_type" AS ENUM('default', 'submissions');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DROP TABLE "submission";--> statement-breakpoint
ALTER TABLE "dataset" ADD COLUMN "type" "dataset_type" DEFAULT 'default' NOT NULL;--> statement-breakpoint
ALTER TABLE "dataset" ADD COLUMN "project_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dataset" ADD CONSTRAINT "dataset_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
