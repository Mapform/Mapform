ALTER TABLE "blob" ADD COLUMN "license_url" varchar(2048);--> statement-breakpoint
ALTER TABLE "blob" ADD COLUMN "source_url" varchar(2048);--> statement-breakpoint
ALTER TABLE "blob" DROP COLUMN IF EXISTS "title";