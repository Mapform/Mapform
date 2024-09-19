ALTER TABLE "teamspace" DROP CONSTRAINT "teamspace_id_slug_unique";--> statement-breakpoint
ALTER TABLE "teamspace" ADD CONSTRAINT "teamspace_workspace_id_slug_unique" UNIQUE("workspace_id","slug");