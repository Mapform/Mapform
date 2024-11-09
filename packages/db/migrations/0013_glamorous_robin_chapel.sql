CREATE TABLE IF NOT EXISTS "magic_link" (
	"token" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "expires" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL;