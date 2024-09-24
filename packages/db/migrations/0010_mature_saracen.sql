ALTER TABLE "layers_to_pages" DROP CONSTRAINT "layers_to_pages_page_id_page_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "layers_to_pages" ADD CONSTRAINT "layers_to_pages_page_id_page_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."page"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
