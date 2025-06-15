DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_root_project_id_project_id_fk" FOREIGN KEY ("root_project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
