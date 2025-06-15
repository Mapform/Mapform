DROP TABLE "account" CASCADE;--> statement-breakpoint
DROP TABLE "authenticator" CASCADE;--> statement-breakpoint
DROP TABLE "verification_token" CASCADE;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "emailVerified";