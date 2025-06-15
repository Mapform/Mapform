CREATE TABLE IF NOT EXISTS "line_cell" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" geometry(LineString, 4326),
	"cell_id" uuid NOT NULL,
	CONSTRAINT "line_cell_unq" UNIQUE("cell_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "polygon_cell" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" geometry(Polygon, 4326),
	"cell_id" uuid NOT NULL,
	CONSTRAINT "polygon_cell_unq" UNIQUE("cell_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "line_cell" ADD CONSTRAINT "line_cell_cell_id_cell_id_fk" FOREIGN KEY ("cell_id") REFERENCES "public"."cell"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "polygon_cell" ADD CONSTRAINT "polygon_cell_cell_id_cell_id_fk" FOREIGN KEY ("cell_id") REFERENCES "public"."cell"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "line_spatial_index" ON "line_cell" USING gist ("value");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "polygon_spatial_index" ON "polygon_cell" USING gist ("value");