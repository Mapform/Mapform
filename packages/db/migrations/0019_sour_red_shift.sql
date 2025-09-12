ALTER TABLE "teamspace" DROP CONSTRAINT "teamspace_owner_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "teamspace" ALTER COLUMN "is_private" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "teamspace" DROP COLUMN IF EXISTS "owner_user_id";