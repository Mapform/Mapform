ALTER TABLE "message" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "message" DROP COLUMN IF EXISTS "createdAt";