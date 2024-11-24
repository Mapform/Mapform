CREATE TABLE IF NOT EXISTS "icon_cell" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"icon" varchar(256),
	"cell_id" uuid NOT NULL,
	CONSTRAINT "icon_cell_unq" UNIQUE("cell_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "icon_cell" ADD CONSTRAINT "icon_cell_cell_id_cell_id_fk" FOREIGN KEY ("cell_id") REFERENCES "public"."cell"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
