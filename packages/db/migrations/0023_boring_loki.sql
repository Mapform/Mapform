ALTER TABLE "teamspace" DROP CONSTRAINT "teamspace_workspace_slug_workspace_slug_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teamspace" ADD CONSTRAINT "teamspace_workspace_slug_workspace_slug_fk" FOREIGN KEY ("workspace_slug") REFERENCES "public"."workspace"("slug") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
