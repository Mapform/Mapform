ALTER TABLE "project" DROP CONSTRAINT "project_slug_unique";--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "icon" varchar(256);--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "is_dirty" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "root_project_id" uuid;--> statement-breakpoint
ALTER TABLE "page" ADD COLUMN "banner_image" text;--> statement-breakpoint
ALTER TABLE "page" ADD COLUMN "icon" varchar(256);--> statement-breakpoint
ALTER TABLE "page" ADD COLUMN "title" text;--> statement-breakpoint
ALTER TABLE "page" ADD COLUMN "content" jsonb;--> statement-breakpoint
ALTER TABLE "page" ADD COLUMN "position" smallint NOT NULL;--> statement-breakpoint
ALTER TABLE "project" DROP COLUMN IF EXISTS "slug";