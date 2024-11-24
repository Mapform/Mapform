ALTER TYPE "public"."layer_type" ADD VALUE 'marker';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "marker_layer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"layer_id" uuid NOT NULL,
	"point_column_id" uuid,
	"title_column_id" uuid,
	"description_column_id" uuid,
	"icon_column_id" uuid,
	"color" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "marker_layer" ADD CONSTRAINT "marker_layer_layer_id_layer_id_fk" FOREIGN KEY ("layer_id") REFERENCES "public"."layer"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "marker_layer" ADD CONSTRAINT "marker_layer_point_column_id_column_id_fk" FOREIGN KEY ("point_column_id") REFERENCES "public"."column"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "marker_layer" ADD CONSTRAINT "marker_layer_title_column_id_column_id_fk" FOREIGN KEY ("title_column_id") REFERENCES "public"."column"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "marker_layer" ADD CONSTRAINT "marker_layer_description_column_id_column_id_fk" FOREIGN KEY ("description_column_id") REFERENCES "public"."column"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "marker_layer" ADD CONSTRAINT "marker_layer_icon_column_id_column_id_fk" FOREIGN KEY ("icon_column_id") REFERENCES "public"."column"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
