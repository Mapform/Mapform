ALTER TABLE "teamspace" DROP CONSTRAINT "teamspace_slug_unique";--> statement-breakpoint
ALTER TABLE "workspace" DROP COLUMN IF EXISTS "imageUri";--> statement-breakpoint
ALTER TABLE "teamspace" DROP COLUMN IF EXISTS "imageUri";--> statement-breakpoint
ALTER TABLE "teamspace" ADD CONSTRAINT "teamspace_id_slug_unique" UNIQUE("id","slug");