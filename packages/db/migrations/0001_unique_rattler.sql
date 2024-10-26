ALTER TABLE "teamspace" DROP CONSTRAINT "teamspace_workspace_id_slug_unique";--> statement-breakpoint
ALTER TABLE "teamspace" DROP CONSTRAINT "teamspace_workspace_id_workspace_id_fk";
--> statement-breakpoint
ALTER TABLE "teamspace" ADD COLUMN "workspace_slug" varchar NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teamspace" ADD CONSTRAINT "teamspace_workspace_slug_workspace_slug_fk" FOREIGN KEY ("workspace_slug") REFERENCES "public"."workspace"("slug") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "teamspace" DROP COLUMN IF EXISTS "workspace_id";--> statement-breakpoint
ALTER TABLE "teamspace" ADD CONSTRAINT "teamspace_workspace_slug_slug_unique" UNIQUE("workspace_slug","slug");