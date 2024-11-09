CREATE TABLE IF NOT EXISTS "magic_link" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL;