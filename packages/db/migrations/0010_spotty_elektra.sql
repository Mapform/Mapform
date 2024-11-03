DO $$ BEGIN
 CREATE TYPE "public"."color" AS ENUM('red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'teal', 'cyan', 'gray');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "point_layer" ADD COLUMN "color" text;