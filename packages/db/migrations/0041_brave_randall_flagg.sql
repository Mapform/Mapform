UPDATE "public"."layer" SET "type" = 'point' WHERE "type" = 'marker';--> statement-breakpoint
ALTER TABLE "public"."layer" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."layer_type";--> statement-breakpoint
CREATE TYPE "public"."layer_type" AS ENUM('point', 'line', 'polygon');--> statement-breakpoint
ALTER TABLE "public"."layer" ALTER COLUMN "type" SET DATA TYPE "public"."layer_type" USING "type"::"public"."layer_type";--> statement-breakpoint
DROP TYPE "public"."color";

