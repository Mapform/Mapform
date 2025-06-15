ALTER TABLE "point_layer" ADD COLUMN "icon_column_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "point_layer" ADD CONSTRAINT "point_layer_icon_column_id_column_id_fk" FOREIGN KEY ("icon_column_id") REFERENCES "public"."column"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
