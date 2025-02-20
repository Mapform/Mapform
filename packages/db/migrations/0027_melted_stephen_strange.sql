CREATE TYPE "public"."page_type" AS ENUM('page', 'page_ending');--> statement-breakpoint
ALTER TABLE "page" ADD COLUMN "page_type" "page_type" DEFAULT 'page' NOT NULL;