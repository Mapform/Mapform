ALTER TABLE "ai_token_usage" ALTER COLUMN "workspace_slug" SET DATA TYPE varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ai_token_usage" ADD CONSTRAINT "ai_token_usage_workspace_slug_workspace_slug_fk" FOREIGN KEY ("workspace_slug") REFERENCES "public"."workspace"("slug") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "ai_token_usage" ADD CONSTRAINT "ai_token_usage_workspace_slug_day_unique" UNIQUE("workspace_slug","day");