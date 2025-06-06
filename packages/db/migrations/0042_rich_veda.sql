CREATE TYPE "public"."direction_type" AS ENUM('walking', 'cycling', 'driving');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "direction_layer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"layer_id" uuid NOT NULL,
	"line_column_id" uuid,
	"direction_type" "direction_type" DEFAULT 'walking' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "direction_layer_layer_id_unique" UNIQUE("layer_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "direction_layer" ADD CONSTRAINT "direction_layer_layer_id_layer_id_fk" FOREIGN KEY ("layer_id") REFERENCES "public"."layer"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "direction_layer" ADD CONSTRAINT "direction_layer_line_column_id_column_id_fk" FOREIGN KEY ("line_column_id") REFERENCES "public"."column"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
