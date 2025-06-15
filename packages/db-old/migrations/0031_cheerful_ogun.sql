CREATE TYPE "public"."visibility" AS ENUM('public', 'closed');--> statement-breakpoint
ALTER TABLE "project" DROP CONSTRAINT "project_root_project_id_project_id_fk";
--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "visibility" "visibility" DEFAULT 'public' NOT NULL;--> statement-breakpoint
ALTER TABLE "project" DROP COLUMN IF EXISTS "is_dirty";--> statement-breakpoint
ALTER TABLE "project" DROP COLUMN IF EXISTS "root_project_id";