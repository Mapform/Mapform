CREATE TABLE IF NOT EXISTS "line_layer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"layer_id" uuid NOT NULL,
	"line_column_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "line_layer_layer_id_unique" UNIQUE("layer_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "polygon_layer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"layer_id" uuid NOT NULL,
	"polygon_column_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "polygon_layer_layer_id_unique" UNIQUE("layer_id")
);
--> statement-breakpoint
ALTER TABLE "layer" ADD COLUMN "title_column_id" uuid;--> statement-breakpoint
ALTER TABLE "layer" ADD COLUMN "description_column_id" uuid;--> statement-breakpoint
ALTER TABLE "layer" ADD COLUMN "icon_column_id" uuid;--> statement-breakpoint
ALTER TABLE "layer" ADD COLUMN "color" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "line_layer" ADD CONSTRAINT "line_layer_layer_id_layer_id_fk" FOREIGN KEY ("layer_id") REFERENCES "public"."layer"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "line_layer" ADD CONSTRAINT "line_layer_line_column_id_column_id_fk" FOREIGN KEY ("line_column_id") REFERENCES "public"."column"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "polygon_layer" ADD CONSTRAINT "polygon_layer_layer_id_layer_id_fk" FOREIGN KEY ("layer_id") REFERENCES "public"."layer"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "polygon_layer" ADD CONSTRAINT "polygon_layer_polygon_column_id_column_id_fk" FOREIGN KEY ("polygon_column_id") REFERENCES "public"."column"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "layer" ADD CONSTRAINT "layer_title_column_id_column_id_fk" FOREIGN KEY ("title_column_id") REFERENCES "public"."column"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "layer" ADD CONSTRAINT "layer_description_column_id_column_id_fk" FOREIGN KEY ("description_column_id") REFERENCES "public"."column"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "layer" ADD CONSTRAINT "layer_icon_column_id_column_id_fk" FOREIGN KEY ("icon_column_id") REFERENCES "public"."column"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
