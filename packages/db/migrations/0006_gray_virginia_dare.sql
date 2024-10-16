ALTER TABLE "column" DROP CONSTRAINT "column_page_id_page_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "column" ADD CONSTRAINT "column_page_id_page_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."page"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
