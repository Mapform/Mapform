ALTER TABLE "point_layer" DROP CONSTRAINT "point_layer_point_column_id_column_id_fk";
--> statement-breakpoint
ALTER TABLE "point_layer" DROP CONSTRAINT "point_layer_title_column_id_column_id_fk";
--> statement-breakpoint
ALTER TABLE "point_layer" DROP CONSTRAINT "point_layer_description_column_id_column_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "point_layer" ADD CONSTRAINT "point_layer_point_column_id_column_id_fk" FOREIGN KEY ("point_column_id") REFERENCES "public"."column"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "point_layer" ADD CONSTRAINT "point_layer_title_column_id_column_id_fk" FOREIGN KEY ("title_column_id") REFERENCES "public"."column"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "point_layer" ADD CONSTRAINT "point_layer_description_column_id_column_id_fk" FOREIGN KEY ("description_column_id") REFERENCES "public"."column"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
