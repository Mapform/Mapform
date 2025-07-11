ALTER TABLE "project" ADD COLUMN "center" geometry(Point, 4326) NOT NULL;--> statement-breakpoint
ALTER TABLE "map_view" DROP COLUMN IF EXISTS "center";