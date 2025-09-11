ALTER TABLE "row" ADD COLUMN "stadia_id" varchar(256);--> statement-breakpoint
ALTER TABLE "row" DROP COLUMN IF EXISTS "geoapify_place_id";