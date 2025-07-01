CREATE TYPE "public"."item_type" AS ENUM('folder', 'project');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "file_tree_position" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid,
	"item_type" "item_type" NOT NULL,
	"teamspace_id" uuid NOT NULL,
	"position" smallint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "file_tree_position_teamspace_id_parent_id_position_unique" UNIQUE("teamspace_id","parent_id","position"),
	CONSTRAINT "file_tree_position_teamspace_id_item_type_unique" UNIQUE("teamspace_id","item_type")
);
--> statement-breakpoint
ALTER TABLE "project" DROP CONSTRAINT "project_folder_id_folder_id_fk";
--> statement-breakpoint
ALTER TABLE "folder" DROP CONSTRAINT "custom_fk";
--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "file_tree_position_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "folder" ADD COLUMN "file_tree_position_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "file_tree_position" ADD CONSTRAINT "file_tree_position_teamspace_id_teamspace_id_fk" FOREIGN KEY ("teamspace_id") REFERENCES "public"."teamspace"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "file_tree_position" ADD CONSTRAINT "custom_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."file_tree_position"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_file_tree_position_id_file_tree_position_id_fk" FOREIGN KEY ("file_tree_position_id") REFERENCES "public"."file_tree_position"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "folder" ADD CONSTRAINT "folder_file_tree_position_id_file_tree_position_id_fk" FOREIGN KEY ("file_tree_position_id") REFERENCES "public"."file_tree_position"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "project" DROP COLUMN IF EXISTS "position";--> statement-breakpoint
ALTER TABLE "project" DROP COLUMN IF EXISTS "folder_id";--> statement-breakpoint
ALTER TABLE "folder" DROP COLUMN IF EXISTS "parent_id";--> statement-breakpoint
ALTER TABLE "folder" DROP COLUMN IF EXISTS "position";