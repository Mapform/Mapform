ALTER TABLE "strint_cell" RENAME TO "string_cell";--> statement-breakpoint
ALTER TABLE "string_cell" DROP CONSTRAINT "strint_cell_cell_id_cell_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "string_cell" ADD CONSTRAINT "string_cell_cell_id_cell_id_fk" FOREIGN KEY ("cell_id") REFERENCES "public"."cell"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
