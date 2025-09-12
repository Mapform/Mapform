ALTER TABLE "project" ADD COLUMN "pitch" double precision DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "bearing" double precision DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "zoom" double precision DEFAULT 2 NOT NULL;