CREATE TABLE IF NOT EXISTS "ai_token_usage" (
	"workspace_slug" varchar(256) NOT NULL,
	"day" date NOT NULL,
	"tokens_used" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "plan" ADD COLUMN "daily_ai_token_limit" integer;