ALTER TABLE "point_layer" DROP CONSTRAINT "point_layer_layer_id_layer_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "point_layer" ADD CONSTRAINT "point_layer_layer_id_layer_id_fk" FOREIGN KEY ("layer_id") REFERENCES "public"."layer"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
